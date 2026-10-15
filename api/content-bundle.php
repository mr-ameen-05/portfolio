<?php
/**
 * GET /api/content-bundle.php?course=<slug>
 * The whole course in one tier-filtered payload: course metadata, modules with
 * their lessons (full bodies when unlocked, metadata-only stubs when locked),
 * the resource library, and the glossary. Powers the course SPA so lesson,
 * module, sidebar and search views can all be rendered from one fetch.
 *
 * Response: { "bundle": { ...course, modules: [ { lessons: [...] } ], resources: [...], glossary: [...] } }
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

    json_out(200, ['bundle' => Content::course_bundle($course, $userId)]);
} catch (Throwable $e) {
    app_log('error', ['where' => 'content.bundle', 'msg' => $e->getMessage()]);
    json_out(500, ['error' => 'Could not load the course right now.']);
}
