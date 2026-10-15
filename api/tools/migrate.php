<?php
/**
 * CLI: apply pending SQL migrations.
 *
 *   php api/tools/migrate.php
 *
 * Lives under api/tools/ deliberately: nginx only routes flat /api/<name>.php
 * files, so this script is not reachable over HTTP.
 */

declare(strict_types=1);

if (PHP_SAPI !== 'cli') {
    http_response_code(404);
    exit;
}

require dirname(__DIR__) . '/bootstrap.php';

$dir = dirname(API_ROOT) . '/deploy/mysql/migrations';

try {
    $migrator = new Migrator($dir);
    $report = $migrator->run(static function (string $msg): void {
        fwrite(STDOUT, "[migrate] $msg\n");
    });

    fwrite(STDOUT, sprintf(
        "[migrate] applied=%d skipped=%d warnings=%d\n",
        count($report['applied']),
        count($report['skipped']),
        count($report['warnings'])
    ));
    foreach ($report['warnings'] as $warning) {
        fwrite(STDOUT, "  warn: $warning\n");
    }
    exit(0);
} catch (Throwable $e) {
    fwrite(STDERR, '[migrate] FAILED: ' . $e->getMessage() . "\n");
    exit(1);
}
