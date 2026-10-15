<?php
/**
 * POST /api/content-quiz-submit.php
 * Grades a quiz server-side, records the attempt for the signed-in learner,
 * and returns the result with correct answers + explanations.
 *
 * Request:  { "scope": "module", "scope_id": "<slug>", "answers": { "<qkey>": 2, ... } }
 * Response: { "success": true, "score", "passed", "safety_failed", "results": [...] }
 */

declare(strict_types=1);

require __DIR__ . '/bootstrap.php';

require_post();

$user = Auth::require_auth();
Auth::require_csrf();
RateLimiter::check('quiz_submit');

$data    = read_json();
$scope   = strtolower(trim((string) ($data['scope'] ?? 'module')));
$scopeId = trim((string) ($data['scope_id'] ?? ''));
$answers = $data['answers'] ?? [];

if (!in_array($scope, ['module', 'lesson'], true)) {
    json_out(400, ['error' => 'Invalid quiz scope.']);
}
if ($scopeId === '') {
    json_out(400, ['error' => 'A quiz scope_id is required.']);
}
if (!is_array($answers)) {
    json_out(400, ['error' => 'Answers must be an object.']);
}

try {
    $quiz = Content::quiz_row($scope, $scopeId);
    if ($quiz === null) {
        json_out(404, ['error' => 'Quiz not found.']);
    }

    $courseSlug = Content::course_slug_for_quiz($scope, $scopeId);
    if ($courseSlug !== null && !Auth::has_tier((int) $user['user_id'], $courseSlug, (string) $quiz['access_tier'])) {
        json_out(403, ['error' => 'This quiz requires a higher access level.', 'code' => 'locked']);
    }

    $result = Content::grade($quiz, $answers);

    $token = bin2hex(random_bytes(32));
    $stmt = Database::pdo()->prepare(
        'INSERT INTO quiz_attempts
            (user_id, learner_id, quiz_id, score, passed, safety_failed, verification_token, ip)
         VALUES (:uid, :learner, :quiz, :score, :passed, :safety, :token, :ip)'
    );
    $stmt->execute([
        ':uid'     => (int) $user['user_id'],
        ':learner' => 'user:' . (int) $user['user_id'],
        ':quiz'    => $scopeId,
        ':score'   => $result['score'],
        ':passed'  => $result['passed'] ? 1 : 0,
        ':safety'  => $result['safety_failed'] ? 1 : 0,
        ':token'   => $token,
        ':ip'      => client_ip(),
    ]);

    json_out(200, array_merge(
        [
            'success'          => true,
            'scope'            => $scope,
            'scope_id'         => $scopeId,
            'verification_token' => $token,
        ],
        $result
    ));
} catch (Throwable $e) {
    app_log('error', ['where' => 'content.quiz_submit', 'msg' => $e->getMessage()]);
    json_out(500, ['error' => 'Could not grade this quiz right now.']);
}
