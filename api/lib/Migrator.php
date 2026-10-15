<?php
declare(strict_types=1);

/**
 * Runs numbered SQL migrations from a directory exactly once each, tracking
 * applied files in `schema_migrations`.
 *
 * Duplicate/reserved errors are ignored so idempotent DDL (CREATE TABLE
 * IF NOT EXISTS, guarded ALTERs) can be re-run safely.
 */
final class Migrator
{
    /** MySQL error codes that mean "already in the desired state". */
    private const IGNORABLE = [1050, 1060, 1061, 1091];

    public function __construct(private string $dir)
    {
    }

    /**
     * @param callable(string):void|null $log
     * @return array{applied: string[], skipped: string[], warnings: string[]}
     */
    public function run(?callable $log = null): array
    {
        $log ??= static function (string $m): void {
        };

        $pdo = Database::pdo();
        $pdo->exec(
            'CREATE TABLE IF NOT EXISTS schema_migrations (
                filename   VARCHAR(191) NOT NULL,
                applied_at DATETIME     NOT NULL DEFAULT CURRENT_TIMESTAMP,
                PRIMARY KEY (filename)
             ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci'
        );

        $existing = $pdo->query('SELECT filename FROM schema_migrations')->fetchAll(PDO::FETCH_COLUMN);
        $existing = array_flip($existing);

        $files = glob(rtrim($this->dir, '/') . '/*.sql') ?: [];
        sort($files);

        $report = ['applied' => [], 'skipped' => [], 'warnings' => []];

        foreach ($files as $file) {
            $name = basename($file);
            if (isset($existing[$name])) {
                $report['skipped'][] = $name;
                continue;
            }

            $sql = (string) file_get_contents($file);
            foreach ($this->split_statements($sql) as $statement) {
                try {
                    $pdo->exec($statement);
                } catch (PDOException $e) {
                    $code = (int) ($e->errorInfo[1] ?? 0);
                    if (in_array($code, self::IGNORABLE, true)) {
                        $report['warnings'][] = "$name: ignored MySQL error $code";
                        continue;
                    }
                    throw new RuntimeException("Migration $name failed: " . $e->getMessage(), 0, $e);
                }
            }

            $ins = $pdo->prepare('INSERT INTO schema_migrations (filename) VALUES (:f)');
            $ins->execute([':f' => $name]);
            $report['applied'][] = $name;
            $log("applied $name");
        }

        return $report;
    }

    /**
     * Splits a SQL script into individual statements, respecting single/double
     * quotes, backticks, `--` and `#` line comments, and block comments.
     *
     * @return string[]
     */
    private function split_statements(string $sql): array
    {
        $statements = [];
        $buffer = '';
        $len = strlen($sql);
        $inSingle = $inDouble = $inBacktick = false;
        $inLineComment = $inBlockComment = false;

        for ($i = 0; $i < $len; $i++) {
            $c = $sql[$i];
            $next = $i + 1 < $len ? $sql[$i + 1] : '';

            if ($inLineComment) {
                if ($c === "\n") {
                    $inLineComment = false;
                }
                continue;
            }
            if ($inBlockComment) {
                if ($c === '*' && $next === '/') {
                    $inBlockComment = false;
                    $i++;
                }
                continue;
            }

            if (!$inSingle && !$inDouble && !$inBacktick) {
                if ($c === '-' && $next === '-') {
                    $inLineComment = true;
                    $i++;
                    continue;
                }
                if ($c === '#') {
                    $inLineComment = true;
                    continue;
                }
                if ($c === '/' && $next === '*') {
                    $inBlockComment = true;
                    $i++;
                    continue;
                }
            }

            if ($c === "'" && !$inDouble && !$inBacktick) {
                $inSingle = !$inSingle;
                $buffer .= $c;
                continue;
            }
            if ($c === '"' && !$inSingle && !$inBacktick) {
                $inDouble = !$inDouble;
                $buffer .= $c;
                continue;
            }
            if ($c === '`' && !$inSingle && !$inDouble) {
                $inBacktick = !$inBacktick;
                $buffer .= $c;
                continue;
            }

            if ($c === ';' && !$inSingle && !$inDouble && !$inBacktick) {
                $trimmed = trim($buffer);
                if ($trimmed !== '') {
                    $statements[] = $trimmed;
                }
                $buffer = '';
                continue;
            }

            $buffer .= $c;
        }

        $trimmed = trim($buffer);
        if ($trimmed !== '') {
            $statements[] = $trimmed;
        }

        return $statements;
    }
}
