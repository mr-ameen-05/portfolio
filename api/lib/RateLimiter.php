<?php
declare(strict_types=1);

/**
 * Small file-based per-IP rate limiter (sliding 60s window).
 * Adequate for a low-traffic portfolio API without extra infrastructure.
 */
final class RateLimiter
{
    public static function check(string $bucket): void
    {
        $limit = env_int('RATE_LIMIT_PER_MINUTE', 20);
        if ($limit <= 0) {
            return;
        }

        $dir = rtrim((string) env('LOG_DIR', '/var/log/aiameen'), '/') . '/ratelimit';
        if (!is_dir($dir)) {
            @mkdir($dir, 0770, true);
        }

        $file = $dir . '/' . hash('sha256', $bucket . '|' . client_ip()) . '.json';
        $now  = time();

        $hits = [];
        if (is_file($file)) {
            $decoded = json_decode((string) file_get_contents($file), true);
            if (is_array($decoded)) {
                $hits = array_values(array_filter($decoded, static fn ($t) => is_int($t) && $t > $now - 60));
            }
        }

        if (count($hits) >= $limit) {
            app_log('ratelimit', ['bucket' => $bucket, 'ip' => client_ip()]);
            json_out(429, ['error' => 'Too many requests. Please wait a moment and try again.']);
        }

        $hits[] = $now;
        @file_put_contents($file, json_encode($hits), LOCK_EX);
    }
}
