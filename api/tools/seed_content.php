<?php
/**
 * CLI: load the exported course snapshot into MySQL.
 *
 *   php scripts/export-course-content.mjs   # regenerate the JSON (Node)
 *   php api/tools/seed_content.php          # load it into the database
 *
 * Idempotent: courses/modules/lessons/quizzes/resources/glossary are upserted
 * by their natural keys, and rows removed from the snapshot are pruned. Learner
 * progress is preserved because lessons are updated in place (never dropped) as
 * long as their slug survives.
 *
 * Lives under api/tools/ so it is not reachable over HTTP.
 */

declare(strict_types=1);

if (PHP_SAPI !== 'cli') {
    http_response_code(404);
    exit;
}

require dirname(__DIR__) . '/bootstrap.php';

const SNAPSHOT = '/deploy/content/course-teaming.json';

function jenc(mixed $value): string
{
    return json_encode($value, JSON_UNESCAPED_SLASHES | JSON_UNESCAPED_UNICODE) ?: 'null';
}

/** Builds a `?, ?, ?` placeholder list for an IN() clause. */
function placeholders(array $values): string
{
    return implode(',', array_fill(0, count($values), '?'));
}

try {
    $path = dirname(API_ROOT) . SNAPSHOT;
    if (!is_file($path)) {
        fwrite(STDERR, "[seed] snapshot not found: $path\n");
        fwrite(STDERR, "[seed] run: node scripts/export-course-content.mjs\n");
        exit(1);
    }

    $data = json_decode((string) file_get_contents($path), true);
    if (!is_array($data) || !isset($data['course'], $data['modules'])) {
        fwrite(STDERR, "[seed] snapshot is malformed\n");
        exit(1);
    }

    $pdo = Database::pdo();
    $pdo->beginTransaction();

    // ── course ─────────────────────────────────────────────────────────────
    $c = $data['course'];
    $stmt = $pdo->prepare(
        'INSERT INTO courses
            (slug, title, summary, description, version, status, audience,
             estimated_weeks, hours_per_week, prerequisites, outcomes,
             safety_statement, published_at)
         VALUES
            (:slug, :title, :summary, :description, :version, :status, :audience,
             :weeks, :hours, :prereq, :outcomes, :safety, :published)
         ON DUPLICATE KEY UPDATE
            title = VALUES(title), summary = VALUES(summary),
            description = VALUES(description), version = VALUES(version),
            status = VALUES(status), audience = VALUES(audience),
            estimated_weeks = VALUES(estimated_weeks),
            hours_per_week = VALUES(hours_per_week),
            prerequisites = VALUES(prerequisites), outcomes = VALUES(outcomes),
            safety_statement = VALUES(safety_statement),
            published_at = VALUES(published_at)'
    );
    $stmt->execute([
        ':slug'        => $c['slug'],
        ':title'       => $c['title'],
        ':summary'     => $c['summary'],
        ':description' => $c['description'],
        ':version'     => $c['version'],
        ':status'      => $c['status'] === 'published' ? 'published' : 'draft',
        ':audience'    => $c['audience'],
        ':weeks'       => $c['estimated_weeks'],
        ':hours'       => $c['hours_per_week'],
        ':prereq'      => jenc($c['prerequisites'] ?? []),
        ':outcomes'    => jenc($c['outcomes'] ?? []),
        ':safety'      => $c['safety_statement'],
        ':published'   => $c['published_at'] ?: null,
    ]);

    $courseStmt = $pdo->prepare('SELECT id FROM courses WHERE slug = :slug');
    $courseStmt->execute([':slug' => $c['slug']]);
    $courseId = (int) $courseStmt->fetchColumn();

    // ── modules + lessons ──────────────────────────────────────────────────
    $moduleUpsert = $pdo->prepare(
        'INSERT INTO modules
            (course_id, phase_id, sort_order, slug, title, summary, objectives, track, access_tier)
         VALUES
            (:course, NULL, :order, :slug, :title, :summary, :objectives, :track, :tier)
         ON DUPLICATE KEY UPDATE
            course_id = VALUES(course_id), sort_order = VALUES(sort_order),
            title = VALUES(title), summary = VALUES(summary),
            objectives = VALUES(objectives), track = VALUES(track),
            access_tier = VALUES(access_tier)'
    );

    $lessonUpsert = $pdo->prepare(
        'INSERT INTO lessons
            (module_id, sort_order, slug, title, required, estimated_minutes, access_tier,
             why_this_matters, level, version, objectives, key_terms, sections, refs,
             last_reviewed_at, published_at)
         VALUES
            (:module, :order, :slug, :title, :required, :minutes, :tier,
             :why, :level, :version, :objectives, :key_terms, :sections, :refs,
             :reviewed, :published)
         ON DUPLICATE KEY UPDATE
            module_id = VALUES(module_id), sort_order = VALUES(sort_order),
            title = VALUES(title), required = VALUES(required),
            estimated_minutes = VALUES(estimated_minutes), access_tier = VALUES(access_tier),
            why_this_matters = VALUES(why_this_matters), level = VALUES(level),
            version = VALUES(version), objectives = VALUES(objectives),
            key_terms = VALUES(key_terms), sections = VALUES(sections), refs = VALUES(refs),
            last_reviewed_at = VALUES(last_reviewed_at), published_at = VALUES(published_at)'
    );

    $tierByModule = [];
    $tierByLesson = [];
    $moduleIds = [];
    $lessonSlugs = [];

    foreach ($data['modules'] as $m) {
        $moduleUpsert->execute([
            ':course'     => $courseId,
            ':order'      => (int) $m['sort_order'],
            ':slug'       => $m['slug'],
            ':title'      => $m['title'],
            ':summary'    => $m['summary'] ?? '',
            ':objectives' => jenc($m['objectives'] ?? []),
            ':track'      => $m['track'],
            ':tier'       => $m['access_tier'],
        ]);

        $ms = $pdo->prepare('SELECT id FROM modules WHERE slug = :slug');
        $ms->execute([':slug' => $m['slug']]);
        $moduleId = (int) $ms->fetchColumn();
        $moduleIds[] = $moduleId;
        $tierByModule[$m['slug']] = $m['access_tier'];

        foreach ($m['lessons'] as $lesson) {
            $lessonUpsert->execute([
                ':module'    => $moduleId,
                ':order'     => (int) $lesson['sort_order'],
                ':slug'      => $lesson['slug'],
                ':title'     => $lesson['title'],
                ':required'  => !empty($lesson['required']) ? 1 : 0,
                ':minutes'   => (int) $lesson['estimated_minutes'],
                ':tier'      => $lesson['access_tier'],
                ':why'       => $lesson['why_this_matters'] ?? '',
                ':level'     => ($lesson['level'] ?? 'beginner') === 'intermediate' ? 'intermediate' : 'beginner',
                ':version'   => $lesson['version'] ?? '1.0.0',
                ':objectives' => jenc($lesson['objectives'] ?? []),
                ':key_terms' => jenc($lesson['key_terms'] ?? []),
                ':sections'  => jenc($lesson['sections'] ?? []),
                ':refs'      => jenc($lesson['refs'] ?? []),
                ':reviewed'  => $lesson['last_reviewed_at'] ?: null,
                ':published' => $lesson['published_at'] ?: null,
            ]);
            $lessonSlugs[] = $lesson['slug'];
            $tierByLesson[$lesson['slug']] = $lesson['access_tier'];
        }
    }

    // ── quizzes ────────────────────────────────────────────────────────────
    $quizUpsert = $pdo->prepare(
        'INSERT INTO quizzes (scope, scope_id, title, passing_score, requires_safety_pass, access_tier)
         VALUES (:scope, :scope_id, :title, :pass, :safety, :tier)
         ON DUPLICATE KEY UPDATE
            title = VALUES(title), passing_score = VALUES(passing_score),
            requires_safety_pass = VALUES(requires_safety_pass), access_tier = VALUES(access_tier)'
    );
    $questionInsert = $pdo->prepare(
        'INSERT INTO quiz_questions
            (quiz_id, question_key, sort_order, prompt, choices, correct_index, explanation, critical)
         VALUES (:quiz, :key, :order, :prompt, :choices, :correct, :explanation, :critical)'
    );
    $questionClear = $pdo->prepare('DELETE FROM quiz_questions WHERE quiz_id = :q');

    foreach ($data['quizzes'] ?? [] as $q) {
        $tier = 'enrolled';
        if ($q['scope'] === 'module' && isset($tierByModule[$q['scope_id']])) {
            $tier = $tierByModule[$q['scope_id']];
        } elseif ($q['scope'] === 'lesson' && isset($tierByLesson[$q['scope_id']])) {
            $tier = $tierByLesson[$q['scope_id']];
        }

        $quizUpsert->execute([
            ':scope'    => $q['scope'],
            ':scope_id' => $q['scope_id'],
            ':title'    => $q['title'] ?? '',
            ':pass'     => (int) ($q['passing_score'] ?? 70),
            ':safety'   => !empty($q['requires_safety_pass']) ? 1 : 0,
            ':tier'     => $tier,
        ]);

        $qs = $pdo->prepare('SELECT id FROM quizzes WHERE scope = :scope AND scope_id = :sid');
        $qs->execute([':scope' => $q['scope'], ':sid' => $q['scope_id']]);
        $quizId = (int) $qs->fetchColumn();

        $questionClear->execute([':q' => $quizId]);

        $order = 0;
        foreach ($q['questions'] ?? [] as $question) {
            $questionInsert->execute([
                ':quiz'        => $quizId,
                ':key'         => $question['key'],
                ':order'       => $order++,
                ':prompt'      => $question['prompt'],
                ':choices'     => jenc($question['choices']),
                ':correct'     => (int) $question['correct_index'],
                ':explanation' => $question['explanation'] ?? '',
                ':critical'    => !empty($question['critical']) ? 1 : 0,
            ]);
        }
    }

    // ── resources ──────────────────────────────────────────────────────────
    $resourceUpsert = $pdo->prepare(
        'INSERT INTO resources
            (course_id, resource_key, title, description, type, file_format, version, license, content_md, access_tier)
         VALUES
            (:course, :key, :title, :description, :type, :format, :version, :license, :content, :tier)
         ON DUPLICATE KEY UPDATE
            course_id = VALUES(course_id), title = VALUES(title),
            description = VALUES(description), type = VALUES(type),
            file_format = VALUES(file_format), version = VALUES(version),
            license = VALUES(license), content_md = VALUES(content_md),
            access_tier = VALUES(access_tier)'
    );
    $resourceKeys = [];
    foreach ($data['resources'] ?? [] as $r) {
        $resourceUpsert->execute([
            ':course'      => $courseId,
            ':key'         => $r['key'],
            ':title'       => $r['title'],
            ':description' => $r['description'] ?? '',
            ':type'        => $r['type'],
            ':format'      => $r['file_format'] ?? '',
            ':version'     => $r['version'] ?? '',
            ':license'     => $r['license'] ?? '',
            ':content'     => $r['content_md'] ?? '',
            ':tier'        => $r['access_tier'] ?? 'registered',
        ]);
        $resourceKeys[] = $r['key'];
    }

    // ── glossary ───────────────────────────────────────────────────────────
    $glossaryUpsert = $pdo->prepare(
        'INSERT INTO glossary_terms (term_key, term, acronym, definition, track, related_slugs)
         VALUES (:key, :term, :acronym, :definition, :track, :related)
         ON DUPLICATE KEY UPDATE
            term = VALUES(term), acronym = VALUES(acronym),
            definition = VALUES(definition), track = VALUES(track),
            related_slugs = VALUES(related_slugs)'
    );
    $glossaryKeys = [];
    foreach ($data['glossary'] ?? [] as $g) {
        $glossaryUpsert->execute([
            ':key'        => $g['key'],
            ':term'       => $g['term'],
            ':acronym'    => $g['acronym'] ?? '',
            ':definition' => $g['definition'],
            ':track'      => $g['track'] ?? 'general',
            ':related'    => jenc($g['related_slugs'] ?? []),
        ]);
        $glossaryKeys[] = $g['key'];
    }

    // ── prune rows removed from the snapshot ───────────────────────────────
    if ($moduleIds !== []) {
        $in = placeholders($moduleIds);
        if ($lessonSlugs !== []) {
            $del = $pdo->prepare(
                "DELETE FROM lessons WHERE module_id IN ($in) AND slug NOT IN (" . placeholders($lessonSlugs) . ')'
            );
            $del->execute([...$moduleIds, ...$lessonSlugs]);
        }
        $del = $pdo->prepare("DELETE FROM modules WHERE course_id = ? AND id NOT IN ($in)");
        $del->execute([$courseId, ...$moduleIds]);
    }
    if ($resourceKeys !== []) {
        $del = $pdo->prepare('DELETE FROM resources WHERE resource_key NOT IN (' . placeholders($resourceKeys) . ')');
        $del->execute($resourceKeys);
    }
    if ($glossaryKeys !== []) {
        $del = $pdo->prepare('DELETE FROM glossary_terms WHERE term_key NOT IN (' . placeholders($glossaryKeys) . ')');
        $del->execute($glossaryKeys);
    }

    $pdo->commit();

    fwrite(STDOUT, sprintf(
        "[seed] ok — course #%d, %d modules, %d lessons, %d quizzes, %d resources, %d glossary terms\n",
        $courseId,
        count($moduleIds),
        count($lessonSlugs),
        count($data['quizzes'] ?? []),
        count($resourceKeys),
        count($glossaryKeys)
    ));
    exit(0);
} catch (Throwable $e) {
    if (isset($pdo) && $pdo instanceof PDO && $pdo->inTransaction()) {
        $pdo->rollBack();
    }
    fwrite(STDERR, '[seed] FAILED: ' . $e->getMessage() . "\n");
    exit(1);
}
