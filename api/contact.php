<?php
// Security headers for CORS
header("Access-Control-Allow-Origin: *"); 
header("Access-Control-Allow-Methods: POST, OPTIONS");
header("Access-Control-Allow-Headers: Content-Type");
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

// Get JSON input from React fetch
$data = json_decode(file_get_contents("php://input"));

// Check if data is present
if (empty($data->name) || empty($data->email) || empty($data->subject) || empty($data->message)) {
    http_response_code(400);
    echo json_encode(["error" => "All fields are required"]);
    exit();
}

// Sanitize inputs
$name = htmlspecialchars(strip_tags($data->name));
$email = filter_var($data->email, FILTER_SANITIZE_EMAIL);
$subject = htmlspecialchars(strip_tags($data->subject));
$message = htmlspecialchars(strip_tags($data->message));

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
$email_subject = "Portfolio Inquiry: $subject";

// ==========================================
// HTML EMAIL TEMPLATE
// ==========================================
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
        .message-box { background-color: #f9f9f9; border: 1px solid #eeeeee; padding: 15px; border-radius: 6px; margin-top: 10px; white-space: pre-wrap; font-size: 15px; }
        .footer { background-color: #f8f8f8; padding: 15px; text-align: center; font-size: 12px; color: #999999; border-top: 1px solid #eeeeee; }
    </style>
</head>
<body>
    <div class='container'>
        <div class='header'>
            <h2>NEW CONNECTION</h2>
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
                <span class='label'>Topic</span>
                <span class='value'>$subject</span>
            </div>
            
            <div class='field' style='margin-top: 30px;'>
                <span class='label'>Message</span>
                <div class='message-box'>$message</div>
            </div>
        </div>
        <div class='footer'>
            This message was sent from the contact form on ALAMEEN.DEV
        </div>
    </div>
</body>
</html>
";

// Headers for HTML email
$headers = "MIME-Version: 1.0\r\n";
$headers .= "Content-type: text/html; charset=UTF-8\r\n";
// The email is sent FROM the server to avoid Gmail flagging it as spam (DMARC/SPF checks)
$headers .= "From: Portfolio Contact <no-reply@alameen.dev>\r\n"; 
// But the Reply-To is set to the requester, so hitting "Reply" goes straight to them
$headers .= "Reply-To: $name <$email>\r\n";
$headers .= "X-Mailer: PHP/" . phpversion();

// Send email
$mail_success = @mail($recipient, $email_subject, $email_content, $headers);

// FOR LOCAL TESTING: Log the email to a file so we can see it works even if the local computer can't send outbound mail
$log_entry = "========== NEW MESSAGE ==========\n";
$log_entry .= "Time: " . date('Y-m-d H:i:s') . "\n";
$log_entry .= "To: $recipient\n";
$log_entry .= "From: $name <$email>\n";
$log_entry .= "Subject: $email_subject\n\n";
$log_entry .= "Message:\n$message\n\n";
file_put_contents(__DIR__ . '/local_mail_log.txt', $log_entry, FILE_APPEND);

if ($mail_success) {
    http_response_code(200);
    echo json_encode(["success" => "Message sent successfully!"]);
} else {
    // If mail fails, we still return success locally because it was logged to the file
    http_response_code(200);
    echo json_encode(["success" => "Message logged locally! (Live email sending requires a production server)"]);
}
?>
