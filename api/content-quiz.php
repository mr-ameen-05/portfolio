<?php
/**
 * GET /api/content-quiz.php?scope=module|lesson&scope_id=<slug>
 * Returns a quiz WITHOUT correct answers, gated by its access tier.
 *
 * Response: { "quiz": { scope, scope_id, title, passing_score, questions: [ { key, prompt, choices } ] } }
 */

declare(strict_types=1);

require __DIR__ . '/bootstrap.php';

require_get();

$scope   = strtolower(trim((string) ($_GET['scope'] ?? 'module')));
$scopeId = trim((string) ($_GET['scope_id'] ?? ''));

if (!in_array($scope, ['module', 'lesson'], true)) {
    json_out(400, ['error' => 'Invalid quiz scope.']);
}
if ($scopeId === '') {
    json_out(400, ['error' => 'A quiz scope_id is required.']);
}

if (!Database::isAvailable()) {
    json_out(503, ['error' => 'Content is temporarily unavailable. Please try again shortly.']);
}

try {
    $quiz = Content::quiz_public($scope, $scopeId);
    if ($quiz === null) {
        json_out(404, ['error' => 'Quiz not found.']);
    }

    $courseSlug = Content::course_slug_for_quiz($scope, $scopeId);
    if ($courseSlug !== null) {
        Auth::require_tier($courseSlug, (string) $quiz['access_tier']);
    }

    json_out(200, ['quiz' => $quiz]);
} catch (Throwable $e) {
    app_log('error', ['where' => 'content.quiz', 'msg' => $e->getMessage()]);
    json_out(500, ['error' => 'Could not load this quiz right now.']);
}
