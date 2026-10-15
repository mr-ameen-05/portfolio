<?php
/**
 * POST /api/progress-lesson.php
 * Marks a lesson complete (or clears it) for the signed-in learner.
 *
 * Request:  { "lesson_slug": "...", "completed": true }
 * Response: { "success": true, "lesson_slug", "completed": true }
 */

declare(strict_types=1);

require __DIR__ . '/bootstrap.php';

require_post();

$user = Auth::require_auth();
Auth::require_csrf();

$data     = read_json();
$slug     = trim((string) ($data['lesson_slug'] ?? ''));
$completed = array_key_exists('completed', $data) ? (bool) $data['completed'] : true;

if ($slug === '') {
    json_out(400, ['error' => 'A lesson_slug is required.']);
}

try {
    $lesson = Content::lesson_by_slug($slug);
    if ($lesson === null) {
        json_out(404, ['error' => 'Lesson not found.']);
    }

    $userId = (int) $user['user_id'];
    if (!Auth::has_tier($userId, (string) $lesson['course_slug'], (string) $lesson['access_tier'])) {
        json_out(403, ['error' => 'You do not have access to this lesson.', 'code' => 'locked']);
    }

    if ($completed) {
        $stmt = Database::pdo()->prepare(
            'INSERT INTO lesson_progress (user_id, lesson_id, completed, completed_at)
             VALUES (:u, :l, 1, NOW())
             ON DUPLICATE KEY UPDATE completed = 1, completed_at = NOW()'
        );
        $stmt->execute([':u' => $userId, ':l' => (int) $lesson['id']]);
    } else {
        $stmt = Database::pdo()->prepare(
            'DELETE FROM lesson_progress WHERE user_id = :u AND lesson_id = :l'
        );
        $stmt->execute([':u' => $userId, ':l' => (int) $lesson['id']]);
    }

    json_out(200, ['success' => true, 'lesson_slug' => $slug, 'completed' => $completed]);
} catch (Throwable $e) {
    app_log('error', ['where' => 'progress.lesson', 'msg' => $e->getMessage()]);
    json_out(500, ['error' => 'Could not save your progress right now.']);
}
