<?php
/**
 * GET /api/progress-summary.php?course=<slug>
 * Aggregate progress for the signed-in learner on a course (dashboard).
 *
 * Response: { "summary": { percent, required_completed, required_lessons, next_lesson, ... } }
 */

declare(strict_types=1);

require __DIR__ . '/bootstrap.php';

require_get();

$user = Auth::require_auth();

$slug = trim((string) ($_GET['course'] ?? 'teaming'));

try {
    $course = Content::course_by_slug($slug);
    if ($course === null) {
        json_out(404, ['error' => 'Course not found.']);
    }

    json_out(200, [
        'summary' => Content::course_progress_summary($course, (int) $user['user_id']),
    ]);
} catch (Throwable $e) {
    app_log('error', ['where' => 'progress.summary', 'msg' => $e->getMessage()]);
    json_out(500, ['error' => 'Could not load your summary right now.']);
}
