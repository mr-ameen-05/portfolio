<?php
/**
 * GET /api/auth-me.php
 * Returns the current session (user, csrf token, entitlement tier) or an
 * anonymous payload. Never errors when logged out.
 */

declare(strict_types=1);

require __DIR__ . '/bootstrap.php';

require_get();

$user = Auth::user();

if ($user === null) {
    json_out(200, [
        'authenticated' => false,
        'entitlements'  => ['course' => Accounts::PRODUCT_ID, 'tier' => null, 'access' => 'guest'],
    ]);
}

json_out(200, array_merge(
    ['authenticated' => true],
    Accounts::session_payload($user)
));
