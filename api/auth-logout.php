<?php
/**
 * POST /api/auth-logout.php
 * Destroys the current session and clears the cookie.
 */

declare(strict_types=1);

require __DIR__ . '/bootstrap.php';

require_post();

if (Auth::check()) {
    Auth::require_csrf();
}

Auth::logout();

json_out(200, ['success' => true, 'message' => 'Signed out.']);
