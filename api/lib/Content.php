<?php
declare(strict_types=1);

/**
 * Read-side access to course content stored in MySQL, plus the access
 * annotations the UI needs (locked flags based on the viewer's entitlement).
 *
 * Correct quiz answers never leave the server through the public quiz
 * projection; grading happens here.
 */
final class Content
{
    private static function pdo(): PDO
    {
        return Database::pdo();
    }

    /** Decode a JSON column that may be null/empty. */
    private static function json(mixed $value): array
    {
        if (!is_string($value) || $value === '') {
            return [];
        }
        $decoded = json_decode($value, true);
        return is_array($decoded) ? $decoded : [];
    }

    // ─────────────────────────────── courses ───────────────────────────────

    public static function course_by_slug(string $slug): ?array
    {
        $stmt = self::pdo()->prepare('SELECT * FROM courses WHERE slug = :s LIMIT 1');
        $stmt->execute([':s' => $slug]);
        $row = $stmt->fetch();
        return $row ?: null;
    }

    /** Published catalogue for the public listings. */
    public static function published_courses(): array
    {
        $stmt = self::pdo()->query(
            "SELECT c.id, c.slug, c.title, c.summary, c.version, c.status, c.audience,
                    c.estimated_weeks, c.hours_per_week, c.published_at,
                    (SELECT COUNT(*) FROM modules m WHERE m.course_id = c.id) AS module_count,
                    (SELECT COUNT(*) FROM lessons l
                       JOIN modules m2 ON m2.id = l.module_id
                      WHERE m2.course_id = c.id) AS lesson_count
               FROM courses c
              WHERE c.status = 'published'
              ORDER BY c.title"
        );
        $out = [];
        foreach ($stmt->fetchAll() as $row) {
            $row['module_count'] = (int) $row['module_count'];
            $row['lesson_count'] = (int) $row['lesson_count'];
            $out[] = $row;
        }
        return $out;
    }

    /** Course metadata + module list annotated with the viewer's access. */
    public static function course_overview(array $course, ?int $userId): array
    {
        $slug = (string) $course['slug'];
        $tier = Auth::highest_tier($userId, $slug);

        $stmt = self::pdo()->prepare(
            'SELECT m.id, m.slug, m.title, m.summary, m.objectives, m.track,
                    m.access_tier, m.sort_order,
                    (SELECT COUNT(*) FROM lessons l WHERE l.module_id = m.id) AS lesson_count,
                    (SELECT COALESCE(SUM(l.estimated_minutes), 0) FROM lessons l WHERE l.module_id = m.id) AS total_minutes
               FROM modules m
              WHERE m.course_id = :c
              ORDER BY m.sort_order'
        );
        $stmt->execute([':c' => $course['id']]);

        $modules = [];
        foreach ($stmt->fetchAll() as $m) {
            $m['objectives'] = self::json($m['objectives']);
            $m['lesson_count'] = (int) $m['lesson_count'];
            $m['total_minutes'] = (int) $m['total_minutes'];
            $m['locked'] = !Auth::has_tier($userId, $slug, (string) $m['access_tier']);
            $modules[] = $m;
        }

        return [
            'id'                 => (int) $course['id'],
            'slug'               => $slug,
            'title'              => (string) $course['title'],
            'summary'            => (string) $course['summary'],
            'description'        => (string) $course['description'],
            'version'            => (string) $course['version'],
            'status'             => (string) $course['status'],
            'audience'           => (string) $course['audience'],
            'estimated_weeks'    => (string) $course['estimated_weeks'],
            'hours_per_week'     => (string) $course['hours_per_week'],
            'prerequisites'      => self::json($course['prerequisites']),
            'outcomes'           => self::json($course['outcomes']),
            'safety_statement'   => (string) $course['safety_statement'],
            'published_at'       => $course['published_at'],
            'modules'            => $modules,
            'access'             => $tier ?? 'guest',
        ];
    }

    // ─────────────────────────────── lessons ───────────────────────────────

    public static function lesson_by_slug(string $slug): ?array
    {
        $stmt = self::pdo()->prepare(
            'SELECT l.*, m.slug AS module_slug, m.title AS module_title, m.track AS module_track,
                    m.sort_order AS module_order, c.slug AS course_slug, c.title AS course_title
               FROM lessons l
               JOIN modules m ON m.id = l.module_id
               JOIN courses c ON c.id = m.course_id
              WHERE l.slug = :s
              LIMIT 1'
        );
        $stmt->execute([':s' => $slug]);
        $row = $stmt->fetch();
        return $row ?: null;
    }

    public static function lesson_public(array $lesson): array
    {
        return [
            'slug'              => (string) $lesson['slug'],
            'title'             => (string) $lesson['title'],
            'module'            => [
                'slug'  => (string) $lesson['module_slug'],
                'title' => (string) $lesson['module_title'],
                'track' => (string) $lesson['module_track'],
            ],
            'course_slug'       => (string) $lesson['course_slug'],
            'course_title'      => (string) $lesson['course_title'],
            'sort_order'        => (int) $lesson['sort_order'],
            'module_order'      => (int) $lesson['module_order'],
            'required'          => (bool) $lesson['required'],
            'estimated_minutes' => (int) $lesson['estimated_minutes'],
            'access_tier'       => (string) $lesson['access_tier'],
            'level'             => (string) $lesson['level'],
            'version'           => (string) $lesson['version'],
            'why_this_matters'  => (string) ($lesson['why_this_matters'] ?? ''),
            'objectives'        => self::json($lesson['objectives']),
            'key_terms'         => self::json($lesson['key_terms']),
            'sections'          => self::json($lesson['sections']),
            'references'        => self::json($lesson['refs']),
            'last_reviewed_at'  => $lesson['last_reviewed_at'],
            'published_at'      => $lesson['published_at'],
        ];
    }

    // ─────────────────────────────── quizzes ───────────────────────────────

    /** Quiz with questions but WITHOUT correct answers (safe to send). */
    public static function quiz_public(string $scope, string $scopeId): ?array
    {
        $quiz = self::quiz_row($scope, $scopeId);
        if ($quiz === null) {
            return null;
        }
        $questions = [];
        foreach ($quiz['questions'] as $q) {
            $questions[] = [
                'key'     => $q['key'],
                'prompt'  => $q['prompt'],
                'choices' => $q['choices'],
                'critical' => $q['critical'],
            ];
        }
        return [
            'scope'               => $quiz['scope'],
            'scope_id'            => $quiz['scope_id'],
            'title'               => $quiz['title'],
            'passing_score'       => $quiz['passing_score'],
            'requires_safety_pass' => $quiz['requires_safety_pass'],
            'access_tier'         => $quiz['access_tier'],
            'questions'           => $questions,
        ];
    }

    /** Full quiz including answers + explanations (server-side only). */
    public static function quiz_row(string $scope, string $scopeId): ?array
    {
        $stmt = self::pdo()->prepare(
            'SELECT * FROM quizzes WHERE scope = :scope AND scope_id = :sid LIMIT 1'
        );
        $stmt->execute([':scope' => $scope, ':sid' => $scopeId]);
        $quiz = $stmt->fetch();
        if (!$quiz) {
            return null;
        }

        $qs = self::pdo()->prepare(
            'SELECT question_key, prompt, choices, correct_index, explanation, critical
               FROM quiz_questions WHERE quiz_id = :q ORDER BY sort_order'
        );
        $qs->execute([':q' => $quiz['id']]);

        $questions = [];
        foreach ($qs->fetchAll() as $q) {
            $questions[] = [
                'key'           => (string) $q['question_key'],
                'prompt'        => (string) $q['prompt'],
                'choices'       => self::json($q['choices']),
                'correct_index' => (int) $q['correct_index'],
                'explanation'   => (string) ($q['explanation'] ?? ''),
                'critical'      => (bool) $q['critical'],
            ];
        }

        return [
            'id'                   => (int) $quiz['id'],
            'scope'                => (string) $quiz['scope'],
            'scope_id'             => (string) $quiz['scope_id'],
            'title'                => (string) $quiz['title'],
            'passing_score'        => (int) $quiz['passing_score'],
            'requires_safety_pass' => (bool) $quiz['requires_safety_pass'],
            'access_tier'          => (string) $quiz['access_tier'],
            'questions'            => $questions,
        ];
    }

    /** Course slug a quiz belongs to (module or lesson scope), or null. */
    public static function course_slug_for_quiz(string $scope, string $scopeId): ?string
    {
        if ($scope === 'module') {
            $stmt = self::pdo()->prepare(
                'SELECT c.slug FROM modules m JOIN courses c ON c.id = m.course_id WHERE m.slug = :s LIMIT 1'
            );
        } else {
            $stmt = self::pdo()->prepare(
                'SELECT c.slug FROM lessons l
                   JOIN modules m ON m.id = l.module_id
                   JOIN courses c ON c.id = m.course_id
                  WHERE l.slug = :s LIMIT 1'
            );
        }
        $stmt->execute([':s' => $scopeId]);
        $slug = $stmt->fetchColumn();
        return $slug === false ? null : (string) $slug;
    }

    /**
     * Grades answers server-side.
     * @param array<string,int> $answers question key => chosen index
     * @return array{score:int,passed:bool,safety_failed:bool,correct:int,total:int,results:array<int,array>}
     */
    public static function grade(array $quiz, array $answers): array
    {
        $correct = 0;
        $safetyFailed = false;
        $results = [];

        foreach ($quiz['questions'] as $q) {
            $key = $q['key'];
            $submitted = isset($answers[$key]) && is_numeric($answers[$key]) ? (int) $answers[$key] : -1;
            $isCorrect = $submitted === $q['correct_index'];
            if ($isCorrect) {
                $correct++;
            } elseif ($q['critical']) {
                $safetyFailed = true;
            }
            $results[] = [
                'key'           => $key,
                'correct'       => $isCorrect,
                'submitted'     => $submitted,
                'correct_index' => $q['correct_index'],
                'explanation'   => $q['explanation'],
            ];
        }

        $total = count($quiz['questions']);
        $score = $total > 0 ? (int) round($correct / $total * 100) : 0;
        $passed = $score >= $quiz['passing_score'];
        if ($quiz['requires_safety_pass'] && $safetyFailed) {
            $passed = false;
        }

        return [
            'score'         => $score,
            'passed'        => $passed,
            'safety_failed' => $safetyFailed,
            'correct'       => $correct,
            'total'         => $total,
            'results'       => $results,
        ];
    }

    // ────────────────────────────── resources ──────────────────────────────

    public static function resources_for_course(int $courseId, ?int $userId, string $courseSlug): array
    {
        $stmt = self::pdo()->prepare(
            'SELECT resource_key, title, description, type, file_format, version, license, content_md, access_tier
               FROM resources WHERE course_id = :c ORDER BY title'
        );
        $stmt->execute([':c' => $courseId]);

        $out = [];
        foreach ($stmt->fetchAll() as $r) {
            $unlocked = Auth::has_tier($userId, $courseSlug, (string) $r['access_tier']);
            $out[] = [
                'key'         => (string) $r['resource_key'],
                'title'       => (string) $r['title'],
                'description' => (string) $r['description'],
                'type'        => (string) $r['type'],
                'file_format' => (string) $r['file_format'],
                'version'     => (string) $r['version'],
                'license'     => (string) $r['license'],
                'access_tier' => (string) $r['access_tier'],
                'locked'      => !$unlocked,
                'content_md'  => $unlocked ? (string) $r['content_md'] : null,
            ];
        }
        return $out;
    }

    // ────────────────────────────── glossary ───────────────────────────────

    public static function glossary(): array
    {
        $stmt = self::pdo()->query(
            'SELECT term_key, term, acronym, definition, track, related_slugs
               FROM glossary_terms ORDER BY term'
        );
        $out = [];
        foreach ($stmt->fetchAll() as $g) {
            $out[] = [
                'key'          => (string) $g['term_key'],
                'term'         => (string) $g['term'],
                'acronym'      => (string) $g['acronym'],
                'definition'   => (string) $g['definition'],
                'track'        => (string) $g['track'],
                'related_slugs' => self::json($g['related_slugs']),
            ];
        }
        return $out;
    }

    // ────────────────────────────── progress ───────────────────────────────

    public static function progress_for_user(int $userId): array
    {
        $lessons = self::pdo()->prepare(
            'SELECT l.slug, lp.completed, lp.completed_at
               FROM lesson_progress lp
               JOIN lessons l ON l.id = lp.lesson_id
              WHERE lp.user_id = :u'
        );
        $lessons->execute([':u' => $userId]);

        $attempts = self::pdo()->prepare(
            'SELECT q.scope, q.scope_id, COUNT(*) AS attempts, MAX(a.score) AS best_score,
                    MAX(a.passed) AS passed, MAX(a.created_at) AS last_attempt
               FROM quiz_attempts a
               JOIN quizzes q ON q.scope_id = a.quiz_id
              WHERE a.user_id = :u
              GROUP BY q.scope, q.scope_id'
        );
        $attempts->execute([':u' => $userId]);

        $labs = self::pdo()->prepare(
            'SELECT lab_id, completed, draft, updated_at FROM lab_states WHERE user_id = :u'
        );
        $labs->execute([':u' => $userId]);

        $completed = [];
        foreach ($lessons->fetchAll() as $row) {
            if ((int) $row['completed'] === 1) {
                $completed[] = (string) $row['slug'];
            }
        }

        $quizStates = [];
        foreach ($attempts->fetchAll() as $row) {
            $quizStates[(string) $row['scope_id']] = [
                'scope'        => (string) $row['scope'],
                'attempts'     => (int) $row['attempts'],
                'best_score'   => (int) $row['best_score'],
                'passed'       => (bool) $row['passed'],
                'last_attempt' => $row['last_attempt'],
            ];
        }

        $labStates = [];
        foreach ($labs->fetchAll() as $row) {
            $labStates[(string) $row['lab_id']] = [
                'completed'  => (bool) $row['completed'],
                'draft'      => self::json($row['draft']),
                'updated_at' => $row['updated_at'],
            ];
        }

        return [
            'completed_lessons' => $completed,
            'quizzes'           => $quizStates,
            'labs'              => $labStates,
        ];
    }

    /** Aggregate course progress for the dashboard. */
    public static function course_progress_summary(array $course, int $userId): array
    {
        $courseId = (int) $course['id'];
        $slug     = (string) $course['slug'];

        $stmt = self::pdo()->prepare(
            'SELECT l.id, l.slug, l.title, l.required, l.estimated_minutes, l.access_tier,
                    m.slug AS module_slug, m.title AS module_title, m.track,
                    EXISTS(
                        SELECT 1 FROM lesson_progress lp
                         WHERE lp.user_id = :u AND lp.lesson_id = l.id AND lp.completed = 1
                    ) AS done
               FROM lessons l
               JOIN modules m ON m.id = l.module_id
              WHERE m.course_id = :c
              ORDER BY m.sort_order, l.sort_order'
        );
        $stmt->execute([':u' => $userId, ':c' => $courseId]);

        $requiredTotal = 0;
        $completedAny  = 0;
        $requiredDone  = 0;
        $nextLesson    = null;
        $minutesDone   = 0;

        foreach ($stmt->fetchAll() as $row) {
            $done = (int) $row['done'] === 1;
            $required = (int) $row['required'] === 1;
            if ($required) {
                $requiredTotal++;
                if ($done) {
                    $requiredDone++;
                }
            }
            if ($done) {
                $completedAny++;
                $minutesDone += (int) $row['estimated_minutes'];
            } elseif ($nextLesson === null && Auth::has_tier($userId, $slug, (string) $row['access_tier'])) {
                $nextLesson = ['slug' => (string) $row['slug'], 'title' => (string) $row['title']];
            }
        }

        $quizRow = self::pdo()->prepare(
            'SELECT COUNT(DISTINCT a.quiz_id) AS passed
               FROM quiz_attempts a
              WHERE a.user_id = :u AND a.passed = 1'
        );
        $quizRow->execute([':u' => $userId]);

        $labRow = self::pdo()->prepare(
            'SELECT COUNT(*) AS done FROM lab_states WHERE user_id = :u AND completed = 1'
        );
        $labRow->execute([':u' => $userId]);

        $percent = $requiredTotal > 0 ? (int) round($requiredDone / $requiredTotal * 100) : 0;

        return [
            'course_slug'         => $slug,
            'required_lessons'    => $requiredTotal,
            'required_completed'  => $requiredDone,
            'lessons_completed'   => $completedAny,
            'percent'             => $percent,
            'minutes_completed'   => $minutesDone,
            'quizzes_passed'      => (int) $quizRow->fetchColumn(),
            'labs_completed'      => (int) $labRow->fetchColumn(),
            'next_lesson'         => $nextLesson,
            'access'              => Auth::highest_tier($userId, $slug) ?? 'guest',
        ];
    }
}
