<?php
/**
 * GET /api/health.php
 * Lightweight health probe for uptime checks and post-deploy verification.
 */

declare(strict_types=1);

require __DIR__ . '/bootstrap.php';

$db = false;
try {
    Database::pdo()->query('SELECT 1');
    $db = true;
} catch (Throwable $e) {
    app_log('error', ['where' => 'health.db', 'msg' => $e->getMessage()]);
}

json_out(200, [
    'status'        => 'ok',
    'service'       => 'aiameen-mailing-api',
    'time'          => gmdate('Y-m-d\TH:i:s\Z'),
    'php_version'   => PHP_VERSION,
    'database'      => $db ? 'up' : 'down',
    'mail_transport' => (string) env('MAIL_TRANSPORT', 'mail'),
    'smtp_configured' => (string) env('SMTP_HOST', '') !== '',
]);
