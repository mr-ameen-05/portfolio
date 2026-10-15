<?php
/**
 * POST /api/auth-request-reset.php
 * Starts a password reset. Always returns success to avoid leaking which
 * email addresses have accounts.
 *
 * Request:  { "email": "..." }
 * Response: { "success": true, "message": "..." }
 */

declare(strict_types=1);

require __DIR__ . '/bootstrap.php';

require_post();
RateLimiter::check('auth_request_reset');

$data  = read_json();
$email = strtolower(trim((string) ($data['email'] ?? '')));

if (($e = Validator::email($email)) !== null) {
    json_out(422, ['error' => $e]);
}

$generic = 'If an account exists for that email, a reset link is on its way.';

if (!Database::isAvailable()) {
    // Do not reveal infrastructure state; respond generically.
    json_out(200, ['success' => true, 'message' => $generic]);
}

try {
    $user = Accounts::find_by_email($email);
    if ($user !== null && (string) $user['status'] === 'active') {
        Accounts::send_reset($user);
    }
} catch (Throwable $e) {
    app_log('error', ['where' => 'auth.request_reset', 'msg' => $e->getMessage()]);
}

json_out(200, ['success' => true, 'message' => $generic]);
