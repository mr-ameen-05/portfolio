<?php
/**
 * POST /api/auth-register.php
 * Creates an account, grants the free "registered" course entitlement,
 * starts a session, and sends a verification email.
 *
 * Request:  { "name": "...", "email": "...", "password": "..." }
 * Response: { "success": true, "user": {...}, "csrf": "...", "entitlements": {...} }
 */

declare(strict_types=1);

require __DIR__ . '/bootstrap.php';

require_post();
RateLimiter::check('auth_register');

$data     = read_json();
$name     = (string) ($data['name'] ?? '');
$email    = strtolower(trim((string) ($data['email'] ?? '')));
$password = (string) ($data['password'] ?? '');

$errors = [];
if (($e = Validator::name($name)) !== null) {
    $errors['name'] = $e;
}
if (($e = Validator::email($email)) !== null) {
    $errors['email'] = $e;
}
if (($e = Validator::password($password)) !== null) {
    $errors['password'] = $e;
}
if ($errors !== []) {
    json_out(422, ['error' => 'Please fix the highlighted fields.', 'fields' => $errors]);
}

if (!Database::isAvailable()) {
    json_out(503, ['error' => 'Accounts are temporarily unavailable. Please try again shortly.']);
}

try {
    if (Accounts::find_by_email($email) !== null) {
        json_out(409, ['error' => 'An account with that email already exists.', 'fields' => ['email' => 'That email is already registered.']]);
    }

    $user = Accounts::create_user($name, $email, $password);
    if ($user === []) {
        json_out(500, ['error' => 'We could not create your account. Please try again.']);
    }

    // Free tier: registered access to the course.
    Auth::grant_entitlement((int) $user['id'], Accounts::PRODUCT_ID, 'registered', 'free');

    Auth::create_session((int) $user['id']);

    @Accounts::send_verification($user);

    json_out(201, array_merge(
        ['success' => true, 'message' => 'Account created. Check your inbox to verify your email.'],
        Accounts::session_payload($user)
    ));
} catch (Throwable $e) {
    app_log('error', ['where' => 'auth.register', 'msg' => $e->getMessage()]);
    json_out(500, ['error' => 'Something went wrong creating your account. Please try again.']);
}
