<?php
/**
 * POST /api/auth-verify-email.php
 * Consumes an email-verification token and marks the account verified.
 *
 * Request:  { "token": "<64 hex chars>" }
 * Response: { "success": true, "message": "..." }
 */

declare(strict_types=1);

require __DIR__ . '/bootstrap.php';

require_post();
RateLimiter::check('auth_verify');

$data  = read_json();
$token = (string) ($data['token'] ?? '');

if (($e = Validator::token($token)) !== null) {
    json_out(400, ['error' => $e]);
}

if (!Database::isAvailable()) {
    json_out(503, ['error' => 'Verification is temporarily unavailable. Please try again shortly.']);
}

try {
    $row = Accounts::consume_token($token, 'verify_email');
    if ($row === null) {
        json_out(400, ['error' => 'This verification link is invalid or has expired.']);
    }

    Accounts::mark_token_used((int) $row['id']);

    $stmt = Database::pdo()->prepare(
        'UPDATE users SET email_verified_at = COALESCE(email_verified_at, NOW()) WHERE id = :id'
    );
    $stmt->execute([':id' => (int) $row['user_id']]);

    json_out(200, ['success' => true, 'message' => 'Your email is verified. You are all set.']);
} catch (Throwable $e) {
    app_log('error', ['where' => 'auth.verify', 'msg' => $e->getMessage()]);
    json_out(500, ['error' => 'We could not verify your email. Please try again.']);
}
