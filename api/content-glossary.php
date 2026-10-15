<?php
/**
 * GET /api/content-glossary.php
 * Public glossary terms (no gating).
 *
 * Response: { "terms": [ { key, term, acronym, definition, track, related_slugs } ] }
 */

declare(strict_types=1);

require __DIR__ . '/bootstrap.php';

require_get();

if (!Database::isAvailable()) {
    json_out(200, ['terms' => [], 'unavailable' => true]);
}

try {
    json_out(200, ['terms' => Content::glossary()]);
} catch (Throwable $e) {
    app_log('error', ['where' => 'content.glossary', 'msg' => $e->getMessage()]);
    json_out(500, ['error' => 'Could not load the glossary right now.']);
}
