<?php
/**
 * POST /api/progress-lab.php
 * Saves a contained-lab state (completed flag + optional draft answers) for
 * the signed-in learner.
 *
 * Request:  { "lab_id": "...", "completed": true, "draft": { ... } }
 * Response: { "success": true, "lab_id", "completed" }
 */

declare(strict_types=1);

require __DIR__ . '/bootstrap.php';

require_post();

$user = Auth::require_auth();
Auth::require_csrf();

$data      = read_json();
$labId     = trim((string) ($data['lab_id'] ?? ''));
$completed = !empty($data['completed']);
$draft     = $data['draft'] ?? null;

if ($labId === '' || mb_strlen($labId) > 120) {
    json_out(400, ['error' => 'A valid lab_id is required.']);
}
if ($draft !== null && !is_array($draft)) {
    json_out(400, ['error' => 'Draft state must be an object.']);
}

try {
    $stmt = Database::pdo()->prepare(
        'INSERT INTO lab_states (user_id, lab_id, completed, draft)
         VALUES (:u, :lab, :done, :draft)
         ON DUPLICATE KEY UPDATE completed = VALUES(completed), draft = VALUES(draft)'
    );
    $stmt->execute([
        ':u'     => (int) $user['user_id'],
        ':lab'   => $labId,
        ':done'  => $completed ? 1 : 0,
        ':draft' => $draft === null ? null : json_encode($draft, JSON_UNESCAPED_SLASHES | JSON_UNESCAPED_UNICODE),
    ]);

    json_out(200, ['success' => true, 'lab_id' => $labId, 'completed' => $completed]);
} catch (Throwable $e) {
    app_log('error', ['where' => 'progress.lab', 'msg' => $e->getMessage()]);
    json_out(500, ['error' => 'Could not save your lab progress right now.']);
}
