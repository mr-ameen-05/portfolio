<?php
/**
 * GET /api/content-resources.php?course=<slug>
 * Resource library. Metadata is public; each item's `content_md` is only
 * included when the viewer's tier covers it (otherwise `locked: true`).
 *
 * Response: { "resources": [ { key, title, locked, content_md, ... } ] }
 */

declare(strict_types=1);

require __DIR__ . '/bootstrap.php';

require_get();

$slug = trim((string) ($_GET['course'] ?? ''));
if ($slug === '') {
    json_out(400, ['error' => 'A course slug is required.']);
}

if (!Database::isAvailable()) {
    json_out(503, ['error' => 'Content is temporarily unavailable. Please try again shortly.']);
}

try {
    $course = Content::course_by_slug($slug);
    if ($course === null) {
        json_out(404, ['error' => 'Course not found.']);
    }

    $user   = Auth::user();
    $userId = $user ? (int) $user['user_id'] : null;

    json_out(200, [
        'resources' => Content::resources_for_course((int) $course['id'], $userId, $slug),
    ]);
} catch (Throwable $e) {
    app_log('error', ['where' => 'content.resources', 'msg' => $e->getMessage()]);
    json_out(500, ['error' => 'Could not load the resource library right now.']);
}
