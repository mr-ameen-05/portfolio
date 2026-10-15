<?php
/**
 * GET /api/content-courses.php
 * Public catalogue of published courses.
 *
 * Response: { "courses": [ { slug, title, summary, module_count, lesson_count, ... } ] }
 */

declare(strict_types=1);

require __DIR__ . '/bootstrap.php';

require_get();

if (!Database::isAvailable()) {
    json_out(200, ['courses' => [], 'unavailable' => true]);
}

try {
    json_out(200, ['courses' => Content::published_courses()]);
} catch (Throwable $e) {
    app_log('error', ['where' => 'content.courses', 'msg' => $e->getMessage()]);
    json_out(500, ['error' => 'Could not load courses right now.']);
}
