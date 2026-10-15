<?php
/**
 * POST /api/auth-reset-password.php
 * Consumes a reset token, sets a new password, and invalidates all sessions.
 *
 * Request:  { "token": "<64 hex chars>", "password": "..." }
 * Response: { "success": true, "message": "..." }
 */

declare(strict_types=1);

require __DIR__ . '/bootstrap.php';

require_post();
RateLimiter::check('auth_reset');

$data     = read_json();
$token    = (string) ($data['token'] ?? '');
$password = (string) ($data['password'] ?? '');

if (($e = Validator::token($token)) !== null) {
    json_out(400, ['error' => $e]);
}
if (($e = Validator::password($password)) !== null) {
    json_out(422, ['error' => $e, 'fields' => ['password' => $e]]);
}

if (!Database::isAvailable()) {
    json_out(503, ['error' => 'Password reset is temporarily unavailable. Please try again shortly.']);
}

try {
    $row = Accounts::consume_token($token, 'reset_password');
    if ($row === null) {
        json_out(400, ['error' => 'This reset link is invalid or has expired. Request a new one.']);
    }

    $userId = (int) $row['user_id'];

    $upd = Database::pdo()->prepare('UPDATE users SET password_hash = :p WHERE id = :id');
    $upd->execute([':p' => password_hash($password, PASSWORD_DEFAULT), ':id' => $userId]);

    Accounts::mark_token_used((int) $row['id']);

    // Force re-login everywhere.
    $del = Database::pdo()->prepare('DELETE FROM sessions WHERE user_id = :id');
    $del->execute([':id' => $userId]);

    Auth::clear_cookie();

    json_out(200, ['success' => true, 'message' => 'Your password has been updated. Please sign in.']);
} catch (Throwable $e) {
    app_log('error', ['where' => 'auth.reset', 'msg' => $e->getMessage()]);
    json_out(500, ['error' => 'We could not reset your password. Please try again.']);
}
