<?php
// Security headers for CORS and JSON response
header("Access-Control-Allow-Origin: *");
header("Access-Control-Allow-Methods: POST, OPTIONS");
header("Access-Control-Allow-Headers: Content-Type, Authorization");
header("Content-Type: application/json; charset=UTF-8");

// Handle preflight OPTIONS request
if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
    http_response_code(200);
    exit();
}

// Only allow POST requests
if ($_SERVER['REQUEST_METHOD'] !== 'POST') {
    http_response_code(405);
    echo json_encode(["error" => "Method not allowed"]);
    exit();
}

// Read JSON input
$input = json_decode(file_get_contents("php://input"), true);
if (!$input || empty($input['quiz_id']) || !isset($input['answers'])) {
    http_response_code(400);
    echo json_encode(["error" => "Missing quiz_id or answers payload"]);
    exit();
}

$quizId = htmlspecialchars(strip_tags($input['quiz_id']));
$answers = $input['answers']; // array of questionId => selectedIndex
$learnerId = !empty($input['learner_id']) ? htmlspecialchars(strip_tags($input['learner_id'])) : 'anonymous-learner';

// Server-side secret key for cryptographic verification token
$serverSecret = "Portfolio-Teaming-Verification-Key-2026-Secret";

// =========================================================================
// PROTECTED SERVER-SIDE ANSWER KEYS & EXPLANATIONS
// (Never exposed in raw client bundles)
// =========================================================================
$masterQuizzes = [
    'quiz-mod-00-safety-check' => [
        'passingScore' => 100,
        'requiresSafetyPass' => true,
        'questions' => [
            'q0-1' => ['correct' => 1, 'critical' => true, 'exp' => 'Explicit, written authorization from the verified legal asset owner is the only legal basis for security testing.'],
            'q0-2' => ['correct' => 2, 'critical' => true, 'exp' => 'Encountering third-party or production targets outside the agreed scope triggers an immediate stop condition.'],
            'q0-3' => ['correct' => 1, 'critical' => true, 'exp' => 'Synthetic data guarantees that no real personal information, intellectual property, or production credentials can be exposed.'],
            'q0-4' => ['correct' => 1, 'critical' => true, 'exp' => 'Data minimization mandates collecting and retaining only what is strictly necessary to demonstrate the finding.']
        ]
    ],
    'quiz-mod-01' => [
        'passingScore' => 75,
        'questions' => [
            'q1-1' => ['correct' => 1, 'exp' => 'TCP establishes reliable connections using SYN from client, SYN-ACK from server, and ACK from client.'],
            'q1-2' => ['correct' => 0, 'exp' => '7 = 4+2+1 (rwx), 5 = 4+1 (r-x), 0 = no permissions (---).'],
            'q1-3' => ['correct' => 1, 'exp' => 'HttpOnly tells the browser that the cookie must not be accessible via client-side scripts, protecting session tokens from XSS.'],
            'q1-4' => ['correct' => 2, 'exp' => 'Bursts of 404s targeting paths like /.env or /admin indicate automated brute-force path discovery.']
        ]
    ],
    'quiz-mod-02' => [
        'passingScore' => 75,
        'questions' => [
            'q2-1' => ['correct' => 2, 'exp' => 'Denial of Service attacks target Availability by exhausting system resources.'],
            'q2-2' => ['correct' => 1, 'exp' => 'The user was authenticated; the failure occurred when the server failed to verify permission to access object ID 1.'],
            'q2-3' => ['correct' => 1, 'exp' => 'Tampering involves unauthorized alteration of data in transit or at rest, violating Integrity.'],
            'q2-4' => ['correct' => 1, 'exp' => 'A SIEM identifies and flags suspicious activity as it occurs, making it a classic Detective control.']
        ]
    ],
    'quiz-mod-03' => [
        'passingScore' => 75,
        'questions' => [
            'q3-1' => ['correct' => 1, 'exp' => 'Parameterized queries compile SQL structure separately from data parameters, preventing SQL injection.'],
            'q3-2' => ['correct' => 1, 'exp' => 'Fast general-purpose hashes enable rapid GPU brute-force cracking; adaptive slow functions like Argon2id are required.'],
            'q3-3' => ['correct' => 1, 'exp' => 'Automated bots continuously scrape public git commits for leaked credentials, exploiting exposed keys rapidly.'],
            'q3-4' => ['correct' => 1, 'exp' => 'Contextual output encoding turns executable characters into harmless display representations (&lt;, &gt;).']
        ]
    ],
    'quiz-mod-04' => [
        'passingScore' => 75,
        'questions' => [
            'q4-1' => ['correct' => 1, 'exp' => 'Penetration tests focus on specific scoped targets, while red teams evaluate overall detection, response, and resilience.'],
            'q4-2' => ['correct' => 1, 'exp' => 'The White Cell provides safety governance, deconflicts alerts, and ensures testing does not disrupt business operations.'],
            'q4-3' => ['correct' => 1, 'exp' => 'Passive reconnaissance gathers intelligence from public third-party sources without directly sending traffic to target servers.'],
            'q4-4' => ['correct' => 1, 'exp' => 'Tactics denote the adversary\'s operational objective (Why), whereas Techniques represent the technical mechanism (How).']
        ]
    ],
    'quiz-mod-05' => [
        'passingScore' => 75,
        'questions' => [
            'q5-1' => ['correct' => 1, 'exp' => 'Target verification prevents catastrophic testing of out-of-scope or third-party production infrastructure.'],
            'q5-2' => ['correct' => 1, 'exp' => 'Linux distributions regularly backport security fixes into existing version packages, requiring behavioral verification.'],
            'q5-3' => ['correct' => 1, 'exp' => 'Testing with two controlled test accounts proves horizontal privilege violation definitively while practicing data minimization.'],
            'q5-4' => ['correct' => 1, 'exp' => 'High-quality finding cards focus on clarity, reproducible technical proof, objective impact, and engineering-ready remediations.']
        ]
    ],
    'quiz-mod-06' => [
        'passingScore' => 75,
        'questions' => [
            'q6-1' => ['correct' => 1, 'exp' => 'Professional titles explicitly state the vulnerability classification and the specific affected endpoint without emotional hyperbole.'],
            'q6-2' => ['correct' => 1, 'exp' => 'Overstating minor issues erodes engineering trust, creates unnecessary alarm, and diverts urgent focus away from true high-impact exposures.'],
            'q6-3' => ['correct' => 1, 'exp' => 'Thorough retesting verifies both the original payload and adjacent variations to confirm root-cause parameterization.'],
            'q6-4' => ['correct' => 1, 'exp' => 'The debrief is a collaborative technical session aimed at providing engineering clarity and ensuring teams understand how to remediate root causes.']
        ]
    ],
    'quiz-mod-07' => [
        'passingScore' => 75,
        'questions' => [
            'q7-1' => ['correct' => 1, 'exp' => 'Web daemons or document viewers spawning interactive shells almost never occur during normal operations and represent high-confidence exploit indicators.'],
            'q7-2' => ['correct' => 1, 'exp' => 'Accurate correlation of multi-source attack sequences requires synchronized timestamps (UTC) across all log sources.'],
            'q7-3' => ['correct' => 1, 'exp' => 'Alert fatigue caused by excessive false positives leads directly to ignored alerts and critical missed detections.'],
            'q7-4' => ['correct' => 1, 'exp' => 'The timeline showed an HTTP POST to /api/v1/dispatch/upload writing a .php file, immediately followed by the web server spawning a shell.']
        ]
    ],
    'quiz-mod-08' => [
        'passingScore' => 75,
        'questions' => [
            'q8-1' => ['correct' => 1, 'exp' => 'Volatile memory (RAM) holds irreplaceable forensic evidence (injected code, decrypted keys) that is permanently lost if the machine is rebooted.'],
            'q8-2' => ['correct' => 1, 'exp' => 'RAM and CPU registers are the most volatile data sources and must be acquired before persistent disk storage.'],
            'q8-3' => ['correct' => 1, 'exp' => 'Adversaries with elevated network access frequently monitor internal IT communication channels to anticipate containment maneuvers.'],
            'q8-4' => ['correct' => 1, 'exp' => 'Eradication focuses on eliminating all remnants of the intrusion, revoking compromised access, and patching the root-cause entry point.']
        ]
    ],
    'quiz-mod-09' => [
        'passingScore' => 75,
        'questions' => [
            'q9-1' => ['correct' => 1, 'exp' => 'Active real-world exploitation in the wild (KEV = Yes) combined with high exploit probability and public exposure makes the CVSS 7.5 flaw far more dangerous.'],
            'q9-2' => ['correct' => 1, 'exp' => 'FIDO2 / WebAuthn cryptographic keys are bound to the exact origin URL in the browser, rendering adversary phishing reverse-proxies completely ineffective.'],
            'q9-3' => ['correct' => 1, 'exp' => 'Purple teaming fosters open-book collaboration where red teams execute techniques transparently so blue teams can verify telemetry and optimize detection logic.'],
            'q9-4' => ['correct' => 1, 'exp' => 'The 3-2-1 rule requires three total data copies across two different media formats, with at least one immutable or offsite copy.']
        ]
    ],
    'quiz-mod-10' => [
        'passingScore' => 80,
        'requiresSafetyPass' => true,
        'questions' => [
            'q10-1' => ['correct' => 1, 'critical' => true, 'exp' => 'Testing external third-party infrastructure without explicit written authorization from that third party violates legal boundaries and contracts.'],
            'q10-2' => ['correct' => 1, 'exp' => 'Business logic and authorization bypasses return HTTP 200 OK responses, rendering primitive HTTP error status code detection completely blind.'],
            'q10-3' => ['correct' => 1, 'exp' => 'Enforcing the user\'s authorized tenant/facility ID directly in the database lookup query prevents access to unauthorized records.'],
            'q10-4' => ['correct' => 1, 'critical' => true, 'exp' => 'The course specification mandates that legal authorization and safety boundaries are non-negotiable; passing the safety/scope check with 100% is strictly required.']
        ]
    ]
];

if (!isset($masterQuizzes[$quizId])) {
    http_response_code(404);
    echo json_encode(["error" => "Unknown quiz ID"]);
    exit();
}

$quizConfig = $masterQuizzes[$quizId];
$questions = $quizConfig['questions'];
$totalQuestions = count($questions);
$correctCount = 0;
$safetyFailed = false;
$feedback = [];

foreach ($questions as $qId => $qData) {
    $userSelection = isset($answers[$qId]) ? intval($answers[$qId]) : -1;
    $isCorrect = ($userSelection === $qData['correct']);
    
    if ($isCorrect) {
        $correctCount++;
    } else {
        if (!empty($qData['critical'])) {
            $safetyFailed = true;
        }
    }

    $feedback[$qId] = [
        "is_correct" => $isCorrect,
        "explanation" => $qData['exp']
    ];
}

$scorePercentage = $totalQuestions > 0 ? round(($correctCount / $totalQuestions) * 100) : 0;
$passed = ($scorePercentage >= $quizConfig['passingScore']);

// If safety check required, any missed critical question forces fail
if (!empty($quizConfig['requiresSafetyPass']) && $safetyFailed) {
    $passed = false;
}

// Generate cryptographic verification signature
$signaturePayload = "{$learnerId}:{$quizId}:{$scorePercentage}:" . ($passed ? '1' : '0') . ":{$serverSecret}";
$verificationToken = hash('sha256', $signaturePayload);

// Optional: Log completion locally
$logEntry = date('Y-m-d H:i:s') . " | Learner: {$learnerId} | Quiz: {$quizId} | Score: {$scorePercentage}% | Passed: " . ($passed ? 'YES' : 'NO') . "\n";
@file_put_contents(__DIR__ . '/quiz_verification_log.txt', $logEntry, FILE_APPEND);

http_response_code(200);
echo json_encode([
    "success" => true,
    "quiz_id" => $quizId,
    "score" => $scorePercentage,
    "passed" => $passed,
    "safety_failed" => $safetyFailed,
    "total_questions" => $totalQuestions,
    "correct_count" => $correctCount,
    "feedback" => $feedback,
    "verification_token" => $verificationToken,
    "evaluated_at" => time(),
    "storage_mode" => "server_verified"
]);
?>
