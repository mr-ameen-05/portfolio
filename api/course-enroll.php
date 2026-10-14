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
$data = json_decode(file_get_contents("php://input"));

if (empty($data->name) || empty($data->email)) {
    http_response_code(400);
    echo json_encode(["error" => "Name and email are required"]);
    exit();
}

// Sanitize inputs
$name = htmlspecialchars(strip_tags($data->name));
$email = filter_var($data->email, FILTER_SANITIZE_EMAIL);
$learnerId = !empty($data->learner_id) ? htmlspecialchars(strip_tags($data->learner_id)) : 'unknown-learner';
$enrolledAt = !empty($data->enrolled_at) ? intval($data->enrolled_at) : time();

// Validate email
if (!filter_var($email, FILTER_VALIDATE_EMAIL)) {
    http_response_code(400);
    echo json_encode(["error" => "Invalid email format"]);
    exit();
}

// ==========================================
// CONFIGURATION
// ==========================================
$recipient = "26alameen2005@gmail.com";
$email_subject = "Course Enrollment: Practical Cybersecurity (Teaming)";

// ==========================================
// HTML EMAIL TEMPLATE
// ==========================================
$userAgent = !empty($_SERVER['HTTP_USER_AGENT']) ? htmlspecialchars(strip_tags($_SERVER['HTTP_USER_AGENT'])) : 'n/a';
$clientIp = !empty($_SERVER['REMOTE_ADDR']) ? $_SERVER['REMOTE_ADDR'] : 'n/a';
$enrolledIso = date('Y-m-d H:i:s T', $enrolledAt);

$email_content = "
<!DOCTYPE html>
<html>
<head>
    <style>
        body { font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif; line-height: 1.6; color: #333333; background-color: #f4f4f4; margin: 0; padding: 20px; }
        .container { max-width: 600px; margin: 0 auto; background: #ffffff; border-radius: 8px; overflow: hidden; box-shadow: 0 4px 6px rgba(0,0,0,0.1); }
        .header { background-color: #0A0A0A; padding: 20px; text-align: center; border-bottom: 3px solid #C8FF00; }
        .header h2 { color: #ffffff; margin: 0; font-weight: 600; letter-spacing: 1px; }
        .content { padding: 30px; }
        .field { margin-bottom: 15px; }
        .label { font-size: 12px; text-transform: uppercase; color: #888888; font-weight: bold; letter-spacing: 1px; margin-bottom: 5px; display: block; }
        .value { font-size: 16px; color: #111111; }
        .box { background-color: #f9f9f9; border: 1px solid #eeeeee; padding: 15px; border-radius: 6px; margin-top: 10px; font-size: 14px; word-break: break-word; }
        .footer { background-color: #f8f8f8; padding: 15px; text-align: center; font-size: 12px; color: #999999; border-top: 1px solid #eeeeee; }
    </style>
</head>
<body>
    <div class='container'>
        <div class='header'>
            <h2>NEW COURSE ENROLLMENT</h2>
        </div>
        <div class='content'>
            <div class='field'>
                <span class='label'>Name</span>
                <span class='value'><strong>$name</strong></span>
            </div>
            <div class='field'>
                <span class='label'>Email Address</span>
                <span class='value'><a href='mailto:$email' style='color: #0066cc;'>$email</a></span>
            </div>
            <div class='field'>
                <span class='label'>Course</span>
                <span class='value'>Practical Cybersecurity: Red, Blue &amp; Purple Teaming</span>
            </div>
            <div class='field'>
                <span class='label'>Learner ID</span>
                <span class='value'>$learnerId</span>
            </div>
            <div class='field'>
                <span class='label'>Enrolled At</span>
                <span class='value'>$enrolledIso</span>
            </div>
            <div class='field' style='margin-top: 30px;'>
                <span class='label'>Technical Context</span>
                <div class='box'>
                    <div>Client IP: $clientIp</div>
                    <div>User-Agent: $userAgent</div>
                </div>
            </div>
        </div>
        <div class='footer'>
            This message was sent from the course enrollment gate on ALAMEEN.DEV
        </div>
    </div>
</body>
</html>
";

// Headers for HTML email
$headers = "MIME-Version: 1.0\r\n";
$headers .= "Content-type: text/html; charset=UTF-8\r\n";
// Send FROM the server (helps avoid DMARC/SPF issues in local dev)
$headers .= "From: Course Enrollments <no-reply@aiameen.online>\r\n";
// Reply-To goes to the learner
$headers .= "Reply-To: $name <$email>\r\n";
$headers .= "X-Mailer: PHP/" . phpversion();

// Send email
$mail_success = @mail($recipient, $email_subject, $email_content, $headers);

// Structured log (JSONL) — easy to parse later if needed
$jsonl_entry = json_encode([
    'timestamp' => date('Y-m-d H:i:s'),
    'ts_unix' => time(),
    'name' => $name,
    'email' => $email,
    'learner_id' => $learnerId,
    'enrolled_at' => $enrolledAt,
    'ip' => $clientIp,
    'user_agent' => $userAgent,
    'mail_success' => (bool) $mail_success
]) . "\n";
@file_put_contents(__DIR__ . '/course_enrollments.jsonl', $jsonl_entry, FILE_APPEND);

// Human-readable log
$log_entry = "========== NEW COURSE ENROLLMENT ==========\n";
$log_entry .= "Time: " . date('Y-m-d H:i:s') . "\n";
$log_entry .= "Name: $name\n";
$log_entry .= "Email: $email\n";
$log_entry .= "Learner ID: $learnerId\n";
$log_entry .= "Enrolled At: $enrolledIso\n";
$log_entry .= "IP: $clientIp\n";
$log_entry .= "User-Agent: $userAgent\n";
$log_entry .= "Mail Sent: " . ($mail_success ? 'YES' : 'NO') . "\n\n";
@file_put_contents(__DIR__ . '/course_enrollments_log.txt', $log_entry, FILE_APPEND);

if ($mail_success) {
    http_response_code(200);
    echo json_encode([
        "success" => true,
        "message" => "Enrollment recorded successfully",
        "enrolled_at" => $enrolledAt
    ]);
} else {
    // Still return success (logged locally) so the gate doesn't block in dev environments.
    http_response_code(200);
    echo json_encode([
        "success" => true,
        "message" => "Enrollment logged locally (live email requires a production server)",
        "enrolled_at" => $enrolledAt
    ]);
}
?>
