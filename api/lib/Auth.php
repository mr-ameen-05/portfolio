<?php
declare(strict_types=1);

/**
 * Session-cookie authentication and entitlement checks.
 *
 * Sessions live server-side in `sessions`; the browser only ever holds an
 * opaque random token in an HttpOnly cookie. The token is stored hashed, so a
 * database leak does not expose usable sessions. Entitlements are the single
 * source of truth for course access.
 */
final class Auth
{
    private const COOKIE   = 'aiameen_session';
    private const TTL_DAYS = 30;

    /** Tier hierarchy — a higher rank satisfies a lower requirement. */
    private const TIER_RANK = ['registered' => 1, 'enrolled' => 2];

    private static ?array $cached = null;
    private static bool $resolved = false;

    public static function cookie_name(): string
    {
        return self::COOKIE;
    }

    private static function secure_cookies(): bool
    {
        if (env_bool('FORCE_SECURE_COOKIES', false)) {
            return true;
        }
        $https = (string) ($_SERVER['HTTPS'] ?? '');
        return $https !== '' && strtolower($https) !== 'off';
    }

    // ─────────────────────────────── sessions ───────────────────────────────

    /** Creates a session row + cookie for a user. Returns [token, csrf]. */
    public static function create_session(int $userId): array
    {
        $token = bin2hex(random_bytes(32));
        $csrf  = bin2hex(random_bytes(32));
        $expTs = time() + self::TTL_DAYS * 86400;
        $exp   = gmdate('Y-m-d H:i:s', $expTs);

        $stmt = Database::pdo()->prepare(
            'INSERT INTO sessions (user_id, token_hash, csrf_token, ip, user_agent, expires_at)
             VALUES (:uid, :th, :csrf, :ip, :ua, :exp)'
        );
        $stmt->execute([
            ':uid'  => $userId,
            ':th'   => hash('sha256', $token),
            ':csrf' => $csrf,
            ':ip'   => client_ip(),
            ':ua'   => user_agent(),
            ':exp'  => $exp,
        ]);

        self::set_cookie($token, $expTs);
        return ['token' => $token, 'csrf' => $csrf];
    }

    private static function set_cookie(string $token, int $expires): void
    {
        setcookie(self::COOKIE, $token, [
            'expires'  => $expires,
            'path'     => '/',
            'secure'   => self::secure_cookies(),
            'httponly' => true,
            'samesite' => 'Lax',
        ]);
    }

    public static function clear_cookie(): void
    {
        setcookie(self::COOKIE, '', [
            'expires'  => time() - 3600,
            'path'     => '/',
            'secure'   => self::secure_cookies(),
            'httponly' => true,
            'samesite' => 'Lax',
        ]);
    }

    /** Current user row (+ session meta) or null. Result is cached per request. */
    public static function user(): ?array
    {
        if (self::$resolved) {
            return self::$cached;
        }
        self::$resolved = true;
        self::$cached   = null;

        $token = (string) ($_COOKIE[self::COOKIE] ?? '');
        if ($token === '' || strlen($token) !== 64 || !ctype_xdigit($token)) {
            return null;
        }
        if (!Database::isAvailable()) {
            return null;
        }

        try {
            $stmt = Database::pdo()->prepare(
                'SELECT s.id AS session_id, s.csrf_token, s.expires_at,
                        u.id AS user_id, u.email, u.name, u.role, u.status, u.email_verified_at
                 FROM sessions s
                 JOIN users u ON u.id = s.user_id
                 WHERE s.token_hash = :th
                 LIMIT 1'
            );
            $stmt->execute([':th' => hash('sha256', $token)]);
            $row = $stmt->fetch();
            if (!$row) {
                return null;
            }
            if (strtotime((string) $row['expires_at']) < time()) {
                self::delete_session((int) $row['session_id']);
                return null;
            }
            if ((string) $row['status'] !== 'active') {
                return null;
            }
            self::$cached = $row;
            return $row;
        } catch (Throwable $e) {
            app_log('error', ['where' => 'auth.user', 'msg' => $e->getMessage()]);
            return null;
        }
    }

    public static function check(): bool
    {
        return self::user() !== null;
    }

    public static function require_auth(): array
    {
        $u = self::user();
        if ($u === null) {
            json_out(401, ['error' => 'Authentication required.', 'code' => 'unauthenticated']);
        }
        return $u;
    }

    public static function require_role(string ...$roles): array
    {
        $u = self::require_auth();
        if (!in_array((string) $u['role'], $roles, true)) {
            json_out(403, ['error' => 'You do not have permission to do that.', 'code' => 'forbidden']);
        }
        return $u;
    }

    public static function delete_session(int $sessionId): void
    {
        try {
            $stmt = Database::pdo()->prepare('DELETE FROM sessions WHERE id = :id');
            $stmt->execute([':id' => $sessionId]);
        } catch (Throwable $e) {
            // best effort
        }
    }

    public static function logout(): void
    {
        $u = self::user();
        if ($u !== null) {
            self::delete_session((int) $u['session_id']);
        }
        self::clear_cookie();
        self::$resolved = true;
        self::$cached   = null;
    }

    // ──────────────────────────────── CSRF ──────────────────────────────────

    public static function csrf_token(): ?string
    {
        $u = self::user();
        return $u['csrf_token'] ?? null;
    }

    /** 401/403 unless the request carries the session CSRF token. */
    public static function require_csrf(): void
    {
        $u = self::user();
        if ($u === null) {
            json_out(401, ['error' => 'Authentication required.', 'code' => 'unauthenticated']);
        }
        $sent = (string) ($_SERVER['HTTP_X_CSRF_TOKEN'] ?? ($_POST['_csrf'] ?? ''));
        if ($sent === '' || !hash_equals((string) $u['csrf_token'], $sent)) {
            json_out(403, ['error' => 'Your session token is invalid. Please refresh the page.', 'code' => 'csrf']);
        }
    }

    // ──────────────────────────── entitlements ─────────────────────────────

    /** Highest active tier the user holds for a course, or null. */
    public static function highest_tier(?int $userId, string $productId): ?string
    {
        if ($userId === null || !Database::isAvailable()) {
            return null;
        }
        try {
            $stmt = Database::pdo()->prepare(
                "SELECT tier FROM entitlements
                  WHERE user_id = :uid
                    AND product_type = 'course'
                    AND product_id = :pid
                    AND (expires_at IS NULL OR expires_at > NOW())
                  ORDER BY FIELD(tier, 'enrolled', 'registered') ASC
                  LIMIT 1"
            );
            $stmt->execute([':uid' => $userId, ':pid' => $productId]);
            $tier = $stmt->fetchColumn();
            return $tier === false ? null : (string) $tier;
        } catch (Throwable $e) {
            app_log('error', ['where' => 'auth.tier', 'msg' => $e->getMessage()]);
            return null;
        }
    }

    public static function has_tier(?int $userId, string $productId, string $tier): bool
    {
        if ($tier === 'public') {
            return true;
        }
        $have = self::highest_tier($userId, $productId);
        if ($have === null) {
            return false;
        }
        return (self::TIER_RANK[$have] ?? 0) >= (self::TIER_RANK[$tier] ?? 99);
    }

    /**
     * Guards a tier: public passes for everyone; otherwise requires auth and a
     * sufficient entitlement. Returns the user row (or null for public).
     */
    public static function require_tier(string $productId, string $tier): ?array
    {
        if ($tier === 'public') {
            return self::user();
        }
        $u = self::require_auth();
        if (!self::has_tier((int) $u['user_id'], $productId, $tier)) {
            json_out(403, [
                'error'    => 'This content requires a higher access level.',
                'code'     => 'locked',
                'requires' => $tier,
            ]);
        }
        return $u;
    }

    public static function grant_entitlement(int $userId, string $productId, string $tier, string $source = 'grant'): void
    {
        $stmt = Database::pdo()->prepare(
            "INSERT INTO entitlements (user_id, product_type, product_id, tier, source)
             VALUES (:uid, 'course', :pid, :tier, :src)
             ON DUPLICATE KEY UPDATE tier = VALUES(tier), source = VALUES(source), granted_at = NOW()"
        );
        $stmt->execute([':uid' => $userId, ':pid' => $productId, ':tier' => $tier, ':src' => $source]);
    }
}
