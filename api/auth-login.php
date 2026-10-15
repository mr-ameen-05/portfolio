<?php
/**
 * POST /api/auth-login.php
 * Verifies credentials and establishes a session.
 *
 * Request:  { "email": "...", "password": "..." }
 * Response: { "success": true, "user": {...}, "csrf": "...", "entitlements": {...} }
 */

declare(strict_types=1);

require __DIR__ . '/bootstrap.php';

require_post();
RateLimiter::check('auth_login');

$data     = read_json();
$email    = strtolower(trim((string) ($data['email'] ?? '')));
$password = (string) ($data['password'] ?? '');

if ($email === '' || $password === '') {
    json_out(422, ['error' => 'Enter your email and password.']);
}

if (!Database::isAvailable()) {
    json_out(503, ['error' => 'Accounts are temporarily unavailable. Please try again shortly.']);
}

try {
    $user = Accounts::find_by_email($email);

    // Constant-ish response regardless of whether the account exists.
    if ($user === null || !password_verify($password, (string) $user['password_hash'])) {
        RateLimiter::check('auth_login_fail');
        json_out(401, ['error' => 'Incorrect email or password.']);
    }
    if ((string) $user['status'] !== 'active') {
        json_out(403, ['error' => 'This account is disabled. Contact support if you think this is a mistake.']);
    }

    // Opportunistically upgrade the stored hash if the algorithm changed.
    if (password_needs_rehash((string) $user['password_hash'], PASSWORD_DEFAULT)) {
        $upd = Database::pdo()->prepare('UPDATE users SET password_hash = :p WHERE id = :id');
        $upd->execute([':p' => password_hash($password, PASSWORD_DEFAULT), ':id' => (int) $user['id']]);
    }

    $touch = Database::pdo()->prepare('UPDATE users SET last_login_at = NOW() WHERE id = :id');
    $touch->execute([':id' => (int) $user['id']]);

    Auth::create_session((int) $user['id']);

    json_out(200, array_merge(
        ['success' => true, 'message' => 'Signed in.'],
        Accounts::session_payload($user)
    ));
} catch (Throwable $e) {
    app_log('error', ['where' => 'auth.login', 'msg' => $e->getMessage()]);
    json_out(500, ['error' => 'Something went wrong signing you in. Please try again.']);
}
