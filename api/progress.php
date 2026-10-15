<?php
/**
 * GET /api/progress.php
 * Raw progress for the signed-in learner: completed lessons, quiz attempts,
 * and saved lab states. Requires authentication.
 *
 * Response: { "progress": { completed_lessons, quizzes, labs } }
 */

declare(strict_types=1);

require __DIR__ . '/bootstrap.php';

require_get();

$user = Auth::require_auth();

try {
    json_out(200, ['progress' => Content::progress_for_user((int) $user['user_id'])]);
} catch (Throwable $e) {
    app_log('error', ['where' => 'progress.index', 'msg' => $e->getMessage()]);
    json_out(500, ['error' => 'Could not load your progress right now.']);
}
