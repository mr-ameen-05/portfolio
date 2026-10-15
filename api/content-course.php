<?php
/**
 * GET /api/course.php?slug=<course-slug>
 * Course overview + module list, annotated for the current viewer
 * (modules carry a `locked` flag based on their entitlement).
 *
 * Response: { "course": { ...meta, access, modules: [ { locked, ... } ] } }
 */

declare(strict_types=1);

require __DIR__ . '/bootstrap.php';

require_get();

$slug = trim((string) ($_GET['slug'] ?? ''));
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

    $user     = Auth::user();
    $userId   = $user ? (int) $user['user_id'] : null;

    json_out(200, ['course' => Content::course_overview($course, $userId)]);
} catch (Throwable $e) {
    app_log('error', ['where' => 'course.show', 'msg' => $e->getMessage()]);
    json_out(500, ['error' => 'Could not load the course right now.']);
}
