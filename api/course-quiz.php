<?php
/**
 * POST /api/course-quiz.php
 * Server-side grading of course quizzes + a signed verification token.
 *
 * Request:  { "quiz_id": "...", "answers": { "q1-1": 0, ... }, "learner_id": "..." }
 * Response: { "success": true, "score": 75, "passed": true, ... }
 */

declare(strict_types=1);

require __DIR__ . '/bootstrap.php';

require_post();
RateLimiter::check('quiz');

$input   = read_json();
$quizId  = trim((string) ($input['quiz_id'] ?? ''));
$answers = $input['answers'] ?? null;
$learner = trim((string) ($input['learner_id'] ?? 'anonymous-learner'));

if ($quizId === '' || !is_array($answers)) {
    json_out(400, ['error' => 'Missing quiz_id or answers payload.']);
}
$learner = mb_substr($learner, 0, 64);

$quizzes = require __DIR__ . '/data/quizzes.php';

if (!isset($quizzes[$quizId])) {
    json_out(404, ['error' => 'Unknown quiz ID.']);
}

$quizConfig = $quizzes[$quizId];
$questions  = $quizConfig['questions'];
$total      = count($questions);
$correct    = 0;
$safetyFailed = false;
$feedback   = [];

foreach ($questions as $qId => $qData) {
    $selection = isset($answers[$qId]) && is_numeric($answers[$qId]) ? (int) $answers[$qId] : -1;
    $isCorrect = ($selection === $qData['correct']);

    if ($isCorrect) {
        $correct++;
    } elseif (!empty($qData['critical'])) {
        $safetyFailed = true;
    }

    $feedback[$qId] = [
        'is_correct'  => $isCorrect,
        'explanation' => $qData['exp'],
    ];
}

$score  = $total > 0 ? (int) round(($correct / $total) * 100) : 0;
$passed = ($score >= (int) $quizConfig['passingScore']);
if (!empty($quizConfig['requiresSafetyPass']) && $safetyFailed) {
    $passed = false;
}

// Signed verification token (HMAC-SHA256 over the result).
$secret    = (string) env('QUIZ_SECRET', 'Portfolio-Teaming-Verification-Key-2026-Secret');
$token     = hash_hmac('sha256', "{$learner}:{$quizId}:{$score}:" . ($passed ? '1' : '0'), $secret);

// Audit trail (best-effort).
if (Database::isAvailable()) {
    try {
        $stmt = Database::pdo()->prepare(
            'INSERT INTO quiz_attempts
                (learner_id, quiz_id, score, passed, safety_failed, verification_token, ip, created_at)
             VALUES (:learner, :quiz, :score, :passed, :safety, :token, :ip, NOW())'
        );
        $stmt->execute([
            ':learner' => $learner,
            ':quiz'    => $quizId,
            ':score'   => $score,
            ':passed'  => $passed ? 1 : 0,
            ':safety'  => $safetyFailed ? 1 : 0,
            ':token'   => $token,
            ':ip'      => client_ip(),
        ]);
    } catch (Throwable $e) {
        app_log('error', ['where' => 'quiz.insert', 'msg' => $e->getMessage()]);
    }
}

json_out(200, [
    'success'            => true,
    'quiz_id'            => $quizId,
    'score'              => $score,
    'passed'             => $passed,
    'safety_failed'      => $safetyFailed,
    'total_questions'    => $total,
    'correct_count'      => $correct,
    'feedback'           => $feedback,
    'verification_token' => $token,
    'evaluated_at'       => time(),
    'storage_mode'       => 'server_verified',
]);
