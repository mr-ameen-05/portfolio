<?php
/**
 * GET /api/content-lesson.php?slug=<lesson-slug>
 * Full lesson payload, gated by its access tier.
 *
 * 200 { "lesson": {...} }
 * 401 unauthenticated (registered/enrolled lesson, no session)
 * 403 { code: "locked", requires } when the entitlement is insufficient
 * 404 unknown lesson
 */

declare(strict_types=1);

require __DIR__ . '/bootstrap.php';

require_get();

$slug = trim((string) ($_GET['slug'] ?? ''));
if ($slug === '') {
    json_out(400, ['error' => 'A lesson slug is required.']);
}

if (!Database::isAvailable()) {
    json_out(503, ['error' => 'Content is temporarily unavailable. Please try again shortly.']);
}

try {
    $lesson = Content::lesson_by_slug($slug);
    if ($lesson === null) {
        json_out(404, ['error' => 'Lesson not found.']);
    }

    // Exits with 401/403 when the viewer may not read this lesson.
    Auth::require_tier((string) $lesson['course_slug'], (string) $lesson['access_tier']);

    json_out(200, ['lesson' => Content::lesson_public($lesson)]);
} catch (Throwable $e) {
    app_log('error', ['where' => 'content.lesson', 'msg' => $e->getMessage()]);
    json_out(500, ['error' => 'Could not load this lesson right now.']);
}
