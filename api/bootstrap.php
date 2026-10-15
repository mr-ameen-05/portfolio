<?php
/**
 * aiameen.online — shared bootstrap for the PHP mailing API.
 *
 * Responsibilities:
 *   - load configuration from /etc/aiameen/api.env (or ./api/.env in dev)
 *   - expose small helpers (env(), json_out(), read_json(), …)
 *   - set JSON + CORS + security headers and handle OPTIONS pre-flight
 *   - autoload the local lib/ classes
 *
 * Every endpoint starts with:  require __DIR__ . '/bootstrap.php';
 */

declare(strict_types=1);

define('API_ROOT', __DIR__);

// ─────────────────────────────────────────────────────────────────────────────
// Configuration (key=value file, kept outside the web root in production)
// ─────────────────────────────────────────────────────────────────────────────
(static function (): void {
    $candidates = array_filter([
        getenv('AIAMEEN_ENV_FILE') ?: null,
        '/etc/aiameen/api.env',
        API_ROOT . '/.env',
    ]);

    foreach ($candidates as $file) {
        if (!is_string($file) || !is_file($file) || !is_readable($file)) {
            continue;
        }
        foreach (file($file, FILE_IGNORE_NEW_LINES | FILE_SKIP_EMPTY_LINES) as $line) {
            $line = trim($line);
            if ($line === '' || $line[0] === '#' || !str_contains($line, '=')) {
                continue;
            }
            [$key, $value] = explode('=', $line, 2);
            $key = trim($key);
            $value = trim(trim($value), "\"'");
            if ($key !== '' && getenv($key) === false) {
                putenv("$key=$value");
                $_ENV[$key] = $value;
            }
        }
        break; // first readable file wins
    }
})();

function env(string $key, ?string $default = null): ?string
{
    $value = getenv($key);
    return ($value === false || $value === '') ? $default : $value;
}

function env_int(string $key, int $default): int
{
    $value = env($key);
    return ($value === null || !is_numeric($value)) ? $default : (int) $value;
}

function env_bool(string $key, bool $default = false): bool
{
    $value = env($key);
    if ($value === null) {
        return $default;
    }
    return in_array(strtolower($value), ['1', 'true', 'yes', 'on'], true);
}

// ─────────────────────────────────────────────────────────────────────────────
// Logging
// ─────────────────────────────────────────────────────────────────────────────
function app_log(string $channel, array $context = []): void
{
    $dir = env('LOG_DIR', '/var/log/aiameen') ?? '/var/log/aiameen';
    if (!is_dir($dir)) {
        @mkdir($dir, 0770, true);
    }
    $line = json_encode(
        ['ts' => gmdate('Y-m-d\TH:i:s\Z'), 'channel' => $channel] + $context,
        JSON_UNESCAPED_SLASHES | JSON_UNESCAPED_UNICODE
    );
    @file_put_contents(rtrim($dir, '/') . "/$channel.jsonl", $line . "\n", FILE_APPEND | LOCK_EX);
}

// ─────────────────────────────────────────────────────────────────────────────
// HTTP helpers
// ─────────────────────────────────────────────────────────────────────────────
function json_out(int $status, array $payload): never
{
    http_response_code($status);
    echo json_encode($payload, JSON_UNESCAPED_SLASHES | JSON_UNESCAPED_UNICODE);
    exit;
}

function read_json(): array
{
    $raw = file_get_contents('php://input');
    if ($raw === false || $raw === '') {
        return [];
    }
    $data = json_decode($raw, true);
    return is_array($data) ? $data : [];
}

function require_post(): void
{
    if (($_SERVER['REQUEST_METHOD'] ?? '') !== 'POST') {
        json_out(405, ['error' => 'Method not allowed']);
    }
}

function require_get(): void
{
    $method = $_SERVER['REQUEST_METHOD'] ?? '';
    if ($method !== 'GET' && $method !== 'HEAD') {
        json_out(405, ['error' => 'Method not allowed']);
    }
}

function request_method(): string
{
    return strtoupper((string) ($_SERVER['REQUEST_METHOD'] ?? 'GET'));
}

function client_ip(): string
{
    return $_SERVER['REMOTE_ADDR'] ?? '0.0.0.0';
}

function user_agent(): string
{
    return mb_substr((string) ($_SERVER['HTTP_USER_AGENT'] ?? ''), 0, 255);
}

// ─────────────────────────────────────────────────────────────────────────────
// Headers (JSON, CORS, hardening)
// ─────────────────────────────────────────────────────────────────────────────
header('Content-Type: application/json; charset=UTF-8');
header('X-Content-Type-Options: nosniff');
header('Vary: Origin');

$allowedOrigins = array_filter(array_map('trim', explode(',', (string) env('ALLOWED_ORIGINS', ''))));
$origin = $_SERVER['HTTP_ORIGIN'] ?? '';
if ($origin !== '' && (in_array('*', $allowedOrigins, true) || in_array($origin, $allowedOrigins, true))) {
    header("Access-Control-Allow-Origin: $origin");
    header('Access-Control-Allow-Methods: GET, POST, OPTIONS');
    header('Access-Control-Allow-Headers: Content-Type, X-CSRF-Token');
    header('Access-Control-Max-Age: 86400');
}

if (($_SERVER['REQUEST_METHOD'] ?? '') === 'OPTIONS') {
    http_response_code(204);
    exit;
}

// ─────────────────────────────────────────────────────────────────────────────
// Local classes
// ─────────────────────────────────────────────────────────────────────────────
require_once API_ROOT . '/lib/Database.php';
require_once API_ROOT . '/lib/EmailTemplate.php';
require_once API_ROOT . '/lib/Mailer.php';
require_once API_ROOT . '/lib/RateLimiter.php';
require_once API_ROOT . '/lib/Validator.php';
require_once API_ROOT . '/lib/Auth.php';
require_once API_ROOT . '/lib/Migrator.php';
require_once API_ROOT . '/lib/Accounts.php';
require_once API_ROOT . '/lib/Content.php';
