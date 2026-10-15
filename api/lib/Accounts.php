<?php
declare(strict_types=1);

/**
 * Account lifecycle: creation, email verification tokens, password resets,
 * and the public projection of a user row. Keeps the HTTP endpoints thin and
 * the security-sensitive logic in one place.
 */
final class Accounts
{
    public const PRODUCT_ID = 'teaming';

    /** Public base URL used to build links in emails. */
    public static function base_url(): string
    {
        $configured = rtrim((string) env('SITE_URL', ''), '/');
        if ($configured !== '') {
            return $configured;
        }
        $origins = array_filter(array_map('trim', explode(',', (string) env('ALLOWED_ORIGINS', ''))));
        foreach ($origins as $origin) {
            if ($origin !== '*' && str_starts_with($origin, 'http')) {
                return rtrim($origin, '/');
            }
        }
        return 'https://aiameen.online';
    }

    public static function find_by_email(string $email): ?array
    {
        $stmt = Database::pdo()->prepare('SELECT * FROM users WHERE email = :e LIMIT 1');
        $stmt->execute([':e' => $email]);
        $row = $stmt->fetch();
        return $row ?: null;
    }

    public static function find(int $id): ?array
    {
        $stmt = Database::pdo()->prepare('SELECT * FROM users WHERE id = :id LIMIT 1');
        $stmt->execute([':id' => $id]);
        $row = $stmt->fetch();
        return $row ?: null;
    }

    public static function create_user(string $name, string $email, string $password): array
    {
        $stmt = Database::pdo()->prepare(
            'INSERT INTO users (email, password_hash, name) VALUES (:e, :p, :n)'
        );
        $stmt->execute([
            ':e' => $email,
            ':p' => password_hash($password, PASSWORD_DEFAULT),
            ':n' => $name,
        ]);
        return self::find((int) Database::pdo()->lastInsertId()) ?? [];
    }

    // ──────────────────────────── email tokens ──────────────────────────────

    /** Issues a single-use token, invalidating previous unused ones. */
    public static function issue_token(int $userId, string $purpose, int $ttlSeconds): string
    {
        $del = Database::pdo()->prepare('DELETE FROM email_tokens WHERE user_id = :u AND purpose = :p');
        $del->execute([':u' => $userId, ':p' => $purpose]);

        $token = bin2hex(random_bytes(32));
        $stmt = Database::pdo()->prepare(
            'INSERT INTO email_tokens (user_id, purpose, token_hash, expires_at)
             VALUES (:u, :p, :h, :e)'
        );
        $stmt->execute([
            ':u' => $userId,
            ':p' => $purpose,
            ':h' => hash('sha256', $token),
            ':e' => gmdate('Y-m-d H:i:s', time() + $ttlSeconds),
        ]);
        return $token;
    }

    public static function consume_token(string $token, string $purpose): ?array
    {
        $stmt = Database::pdo()->prepare(
            'SELECT * FROM email_tokens
              WHERE token_hash = :h AND purpose = :p AND used_at IS NULL
              LIMIT 1'
        );
        $stmt->execute([':h' => hash('sha256', $token), ':p' => $purpose]);
        $row = $stmt->fetch();
        if (!$row) {
            return null;
        }
        if (strtotime((string) $row['expires_at']) < time()) {
            return null;
        }
        return $row;
    }

    public static function mark_token_used(int $id): void
    {
        $stmt = Database::pdo()->prepare('UPDATE email_tokens SET used_at = NOW() WHERE id = :id');
        $stmt->execute([':id' => $id]);
    }

    // ─────────────────────────────── emails ─────────────────────────────────

    public static function send_verification(array $user): bool
    {
        $token = self::issue_token((int) $user['id'], 'verify_email', 86400);
        $link  = self::base_url() . '/verify-email?token=' . urlencode($token);

        $html = EmailTemplate::render('VERIFY YOUR EMAIL', [
            ['label' => 'Name',    'value' => (string) $user['name']],
            ['label' => 'Confirm', 'value' => "Open this link to verify your email address:\n$link", 'mono' => true],
            ['label' => 'Expires', 'value' => '24 hours'],
        ], 'If you did not create this account you can safely ignore this email.');

        return Mailer::send(
            'Verify your email — Practical Cybersecurity',
            $html,
            ['to' => (string) $user['email']]
        );
    }

    public static function send_reset(array $user): bool
    {
        $token = self::issue_token((int) $user['id'], 'reset_password', 3600);
        $link  = self::base_url() . '/reset-password?token=' . urlencode($token);

        $html = EmailTemplate::render('RESET YOUR PASSWORD', [
            ['label' => 'Name',    'value' => (string) $user['name']],
            ['label' => 'Reset',   'value' => "Open this link to choose a new password:\n$link", 'mono' => true],
            ['label' => 'Expires', 'value' => '1 hour'],
        ], 'If you did not request a reset you can ignore this email; your password is unchanged.');

        return Mailer::send(
            'Reset your password — Practical Cybersecurity',
            $html,
            ['to' => (string) $user['email']]
        );
    }

    // ──────────────────────────── projections ───────────────────────────────

    /** Safe-to-send representation of a user row (never includes the hash). */
    public static function public_user(array $user): array
    {
        return [
            'id'             => (int) $user['id'],
            'email'          => (string) $user['email'],
            'name'           => (string) $user['name'],
            'role'           => (string) $user['role'],
            'email_verified' => !empty($user['email_verified_at']),
        ];
    }

    /** Tier + verification summary used by the session endpoint. */
    public static function session_payload(array $user): array
    {
        $userId = (int) $user['id'];
        $tier   = Auth::highest_tier($userId, self::PRODUCT_ID);
        return [
            'user'          => self::public_user($user),
            'csrf'          => Auth::csrf_token(),
            'entitlements'  => [
                'course' => self::PRODUCT_ID,
                'tier'   => $tier,
                'access' => $tier ?? 'guest',
            ],
        ];
    }
}
