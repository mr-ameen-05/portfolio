<?php
declare(strict_types=1);

/**
 * Thin PDO wrapper for MySQL. One connection per request.
 */
final class Database
{
    private static ?PDO $pdo = null;

    public static function pdo(): PDO
    {
        if (self::$pdo instanceof PDO) {
            return self::$pdo;
        }

        $dsn = sprintf(
            'mysql:host=%s;port=%s;dbname=%s;charset=utf8mb4',
            env('DB_HOST', '127.0.0.1'),
            env('DB_PORT', '3306'),
            env('DB_NAME', 'aiameen')
        );

        self::$pdo = new PDO($dsn, (string) env('DB_USER', ''), (string) env('DB_PASS', ''), [
            PDO::ATTR_ERRMODE            => PDO::ERRMODE_EXCEPTION,
            PDO::ATTR_DEFAULT_FETCH_MODE => PDO::FETCH_ASSOC,
            PDO::ATTR_EMULATE_PREPARES   => false,
            PDO::ATTR_TIMEOUT            => 5,
        ]);

        return self::$pdo;
    }

    /** Never throws — used where the DB is optional. */
    public static function isAvailable(): bool
    {
        try {
            self::pdo();
            return true;
        } catch (Throwable $e) {
            app_log('error', ['where' => 'db.connect', 'msg' => $e->getMessage()]);
            return false;
        }
    }
}
