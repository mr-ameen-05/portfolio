<?php
// =============================================================================
//  AL AMEEN N R — SECURE PROJECT ENQUIRY & SMTP MAILER DISPATCHER
// =============================================================================

// ── Security Headers & CORS ──────────────────────────────────────────────────
header("Access-Control-Allow-Origin: *");
header("Access-Control-Allow-Methods: POST, OPTIONS");
header("Access-Control-Allow-Headers: Content-Type, Authorization, X-Requested-With");
header("Content-Type: application/json; charset=UTF-8");
header("X-Content-Type-Options: nosniff");
header("X-Frame-Options: DENY");

// Handle preflight OPTIONS request
if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
    http_response_code(200);
    exit();
}

// Enforce POST only
if ($_SERVER['REQUEST_METHOD'] !== 'POST') {
    http_response_code(405);
    echo json_encode(["success" => false, "error" => "Method not allowed. Use POST."]);
    exit();
}

// ── Parse Environment Configuration ──────────────────────────────────────────
function load_env_config(): array {
    $config = [
        'MAIL_TO'          => '26alameen2005@gmail.com',
        'MAIL_FROM_EMAIL'  => 'no-reply@aiameen.online',
        'MAIL_FROM_NAME'   => 'Al Ameen N R',
        'MAIL_TRANSPORT'   => 'smtp',
        'SMTP_HOST'        => 'email-smtp.ap-south-1.amazonaws.com',
        'SMTP_PORT'        => 587,
        'SMTP_USER'        => '',
        'SMTP_PASS'        => '',
        'SMTP_ENCRYPTION'  => 'tls',
        'SMTP_DEBUG'       => 0,
        'LOG_DIR'          => __DIR__,
    ];

    $candidates = [
        '/etc/aiameen/api.env',
        dirname(__DIR__) . '/deploy/deploy.env',
        dirname(__DIR__) . '/.env',
        __DIR__ . '/.env',
    ];

    foreach ($candidates as $filePath) {
        if (file_exists($filePath) && is_readable($filePath)) {
            $lines = file($filePath, FILE_IGNORE_NEW_LINES | FILE_SKIP_EMPTY_LINES);
            if ($lines !== false) {
                foreach ($lines as $line) {
                    $line = trim($line);
                    if ($line === '' || str_starts_with($line, '#')) continue;
                    if (str_contains($line, '=')) {
                        list($key, $val) = explode('=', $line, 2);
                        $key = trim($key);
                        $val = trim($val);
                        // Strip quotes if present
                        if ((str_starts_with($val, '"') && str_ends_with($val, '"')) ||
                            (str_starts_with($val, "'") && str_ends_with($val, "'"))) {
                            $val = substr($val, 1, -1);
                        }
                        if (array_key_exists($key, $config)) {
                            $config[$key] = $val;
                        }
                    }
                }
                break; // Use the first available config file
            }
        }
    }

    // Override with active getenv if provided in environment
    foreach ($config as $k => $defaultVal) {
        $envVal = getenv($k);
        if ($envVal !== false && $envVal !== '') {
            $config[$k] = $envVal;
        }
    }

    $config['SMTP_PORT'] = (int) $config['SMTP_PORT'];
    return $config;
}

$ENV = load_env_config();

// ── Ingest & Sanitize Incoming Payload ─────────────────────────────────────────
$raw_input = file_get_contents("php://input");
$data = json_decode($raw_input);

if (!$data) {
    http_response_code(400);
    echo json_encode(["success" => false, "error" => "Invalid JSON payload."]);
    exit();
}

// Required fields
if (empty($data->name) || empty($data->email) || (empty($data->description) && empty($data->message))) {
    http_response_code(400);
    echo json_encode(["success" => false, "error" => "Name, work email, and a project description are required."]);
    exit();
}

$name        = htmlspecialchars(strip_tags(trim($data->name)));
$email       = filter_var(trim($data->email), FILTER_SANITIZE_EMAIL);
$company     = !empty($data->company) ? htmlspecialchars(strip_tags(trim($data->company))) : 'Individual / Confidential';
$service     = !empty($data->service) ? htmlspecialchars(strip_tags(trim($data->service))) : (!empty($data->subject) ? htmlspecialchars(strip_tags(trim($data->subject))) : 'Technical Consultation');
$timeline    = !empty($data->timeline) ? htmlspecialchars(strip_tags(trim($data->timeline))) : 'Flexible / TBD';
$budget      = !empty($data->budget) ? htmlspecialchars(strip_tags(trim($data->budget))) : 'To be scoped';
$description = !empty($data->description) ? htmlspecialchars(strip_tags(trim($data->description))) : htmlspecialchars(strip_tags(trim($data->message)));

// Validate email format
if (!filter_var($email, FILTER_VALIDATE_EMAIL)) {
    http_response_code(400);
    echo json_encode(["success" => false, "error" => "Please provide a valid email address."]);
    exit();
}

$clientIp  = !empty($_SERVER['HTTP_CF_CONNECTING_IP']) ? $_SERVER['HTTP_CF_CONNECTING_IP'] : (!empty($_SERVER['REMOTE_ADDR']) ? $_SERVER['REMOTE_ADDR'] : 'n/a');
$userAgent = !empty($_SERVER['HTTP_USER_AGENT']) ? htmlspecialchars(strip_tags($_SERVER['HTTP_USER_AGENT'])) : 'n/a';
$timestamp = date('Y-m-d H:i:s T');

// ── Pure PHP Authenticated SMTP Socket Client ─────────────────────────────────
class SimpleSmtpClient {
    private string $host;
    private int $port;
    private string $user;
    private string $pass;
    private string $encryption;
    private int $timeout;
    private $socket = null;
    public string $lastError = '';

    public function __construct(string $host, int $port, string $user, string $pass, string $encryption = 'tls', int $timeout = 15) {
        $this->host = $host;
        $this->port = $port;
        $this->user = $user;
        $this->pass = $pass;
        $this->encryption = strtolower($encryption);
        $this->timeout = $timeout;
    }

    private function getResponse(): string {
        $response = "";
        while ($line = fgets($this->socket, 515)) {
            $response .= $line;
            if (substr($line, 3, 1) === " ") {
                break;
            }
        }
        return $response;
    }

    private function sendCommand(string $command, int $expectedCode): bool {
        fwrite($this->socket, $command . "\r\n");
        $response = $this->getResponse();
        $code = (int) substr($response, 0, 3);
        if ($code !== $expectedCode) {
            $this->lastError = "SMTP Command [$command] failed. Expected $expectedCode, received: $response";
            return false;
        }
        return true;
    }

    public function send(string $from, string $fromName, string $to, string $replyTo, string $subject, string $htmlBody): bool {
        if (empty($this->host)) {
            $this->lastError = "SMTP host not configured.";
            return false;
        }

        $connectionHost = ($this->encryption === 'ssl') ? "ssl://{$this->host}" : "tcp://{$this->host}";
        $errno = 0;
        $errstr = '';
        $this->socket = @fsockopen($connectionHost, $this->port, $errno, $errstr, $this->timeout);

        if (!$this->socket) {
            $this->lastError = "Connection failed to {$this->host}:{$this->port} - $errstr ($errno)";
            return false;
        }

        stream_set_timeout($this->socket, $this->timeout);
        $greet = $this->getResponse();
        if ((int) substr($greet, 0, 3) !== 220) {
            $this->lastError = "Server greeting failed: $greet";
            fclose($this->socket);
            return false;
        }

        $hostname = gethostname() ?: 'localhost';
        if (!$this->sendCommand("EHLO $hostname", 250)) {
            $this->sendCommand("HELO $hostname", 250);
        }

        // Start TLS if required
        if ($this->encryption === 'tls') {
            if ($this->sendCommand("STARTTLS", 220)) {
                $crypto = stream_socket_enable_crypto($this->socket, true, STREAM_CRYPTO_METHOD_TLSv1_2_CLIENT | STREAM_CRYPTO_METHOD_TLSv1_3_CLIENT);
                if (!$crypto) {
                    $this->lastError = "TLS encryption handshake failed.";
                    fclose($this->socket);
                    return false;
                }
                // Re-send EHLO over encrypted channel
                $this->sendCommand("EHLO $hostname", 250);
            }
        }

        // Authenticate with AUTH LOGIN if credentials provided
        if (!empty($this->user) && !empty($this->pass)) {
            if (!$this->sendCommand("AUTH LOGIN", 334)) {
                fclose($this->socket);
                return false;
            }
            if (!$this->sendCommand(base64_encode($this->user), 334)) {
                fclose($this->socket);
                return false;
            }
            if (!$this->sendCommand(base64_encode($this->pass), 235)) {
                fclose($this->socket);
                return false;
            }
        }

        if (!$this->sendCommand("MAIL FROM: <$from>", 250)) {
            fclose($this->socket);
            return false;
        }

        if (!$this->sendCommand("RCPT TO: <$to>", 250)) {
            fclose($this->socket);
            return false;
        }

        if (!$this->sendCommand("DATA", 354)) {
            fclose($this->socket);
            return false;
        }

        $headers = [
            "MIME-Version: 1.0",
            "Content-Type: text/html; charset=UTF-8",
            "From: =?UTF-8?B?" . base64_encode($fromName) . "?= <$from>",
            "To: <$to>",
            "Reply-To: <$replyTo>",
            "Subject: =?UTF-8?B?" . base64_encode($subject) . "?=",
            "Date: " . date('r'),
            "X-Mailer: AlAmeen-Portfolio-SMTP/2.0",
        ];

        $messageData = implode("\r\n", $headers) . "\r\n\r\n" . $htmlBody . "\r\n.";
        if (!$this->sendCommand($messageData, 250)) {
            fclose($this->socket);
            return false;
        }

        $this->sendCommand("QUIT", 221);
        fclose($this->socket);
        return true;
    }
}

// ── Unified Email Delivery Routine ───────────────────────────────────────────
function deliver_email(array $env, string $to, string $replyTo, string $subject, string $htmlContent): bool {
    // 1. Try authenticated SMTP if configured
    if ($env['MAIL_TRANSPORT'] === 'smtp' && !empty($env['SMTP_HOST']) && !empty($env['SMTP_USER'])) {
        $smtp = new SimpleSmtpClient(
            $env['SMTP_HOST'],
            $env['SMTP_PORT'],
            $env['SMTP_USER'],
            $env['SMTP_PASS'],
            $env['SMTP_ENCRYPTION']
        );
        $sent = $smtp->send(
            $env['MAIL_FROM_EMAIL'],
            $env['MAIL_FROM_NAME'],
            $to,
            $replyTo,
            $subject,
            $htmlContent
        );
        if ($sent) return true;
        // Log SMTP error for diagnostics
        error_log("SMTP Error: " . $smtp->lastError);
    }

    // 2. Fallback to PHP mail()
    $headers  = "MIME-Version: 1.0\r\n";
    $headers .= "Content-Type: text/html; charset=UTF-8\r\n";
    $headers .= "From: {$env['MAIL_FROM_NAME']} <{$env['MAIL_FROM_EMAIL']}>\r\n";
    $headers .= "Reply-To: <$replyTo>\r\n";
    $headers .= "X-Mailer: PHP/" . phpversion();

    return (bool) @mail($to, $subject, $htmlContent, $headers);
}

// ── Branded HTML Templates ───────────────────────────────────────────────────

// 1. Technical Enquiry Dossier (Sent to Owner: 26alameen2005@gmail.com)
$admin_subject = "[$service] Project Enquiry from $name ($company)";
$admin_template = "
<!DOCTYPE html>
<html>
<head>
  <meta charset='UTF-8'>
  <style>
    body { margin: 0; padding: 24px; background-color: #0A0A0A; color: #E5E5E5; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif; font-size: 14px; line-height: 1.6; }
    .card { max-width: 620px; margin: 0 auto; background: #111111; border: 1px solid #222222; border-radius: 12px; overflow: hidden; box-shadow: 0 10px 30px rgba(0,0,0,0.5); }
    .header { padding: 24px 30px; background: #161616; border-bottom: 2px solid #C8FF00; }
    .header-tag { font-family: 'Courier New', Courier, monospace; font-size: 11px; text-transform: uppercase; color: #C8FF00; letter-spacing: 2px; margin-bottom: 6px; font-weight: bold; }
    .header-title { font-size: 20px; font-weight: 700; color: #FFFFFF; margin: 0; }
    .content { padding: 30px; }
    .grid { margin-bottom: 24px; }
    .row { padding: 10px 0; border-bottom: 1px solid #1A1A1A; display: flex; }
    .label { width: 140px; font-family: 'Courier New', Courier, monospace; font-size: 11px; text-transform: uppercase; color: #777777; letter-spacing: 1px; font-weight: bold; padding-top: 2px; }
    .value { flex: 1; color: #FFFFFF; font-size: 14px; }
    .badge { display: inline-block; padding: 2px 8px; border-radius: 4px; background: rgba(200, 255, 0, 0.12); color: #C8FF00; border: 1px solid rgba(200, 255, 0, 0.3); font-family: 'Courier New', Courier, monospace; font-size: 12px; font-weight: bold; }
    .brief-title { font-family: 'Courier New', Courier, monospace; font-size: 11px; text-transform: uppercase; color: #777777; letter-spacing: 1px; margin-bottom: 8px; font-weight: bold; }
    .brief-box { background: #0A0A0A; border: 1px solid #262626; border-radius: 8px; padding: 18px; color: #E5E5E5; white-space: pre-wrap; font-size: 14px; line-height: 1.6; }
    .telemetry { margin-top: 24px; padding: 14px 18px; background: #0E0E0E; border: 1px dashed #222222; border-radius: 6px; font-family: 'Courier New', Courier, monospace; font-size: 11px; color: #666666; }
    .footer { padding: 18px 30px; background: #0E0E0E; border-top: 1px solid #1A1A1A; font-size: 11px; color: #666666; text-align: center; font-family: 'Courier New', Courier, monospace; }
  </style>
</head>
<body>
  <div class='card'>
    <div class='header'>
      <div class='header-tag'>SECURITY &bull; SYSTEMS &bull; FORWARD DEPLOYED</div>
      <h1 class='header-title'>New Technical Enquiry Received</h1>
    </div>
    <div class='content'>
      <div class='grid'>
        <div class='row'>
          <div class='label'>Client / Lead:</div>
          <div class='value'><strong>$name</strong></div>
        </div>
        <div class='row'>
          <div class='label'>Work Email:</div>
          <div class='value'><a href='mailto:$email' style='color: #C8FF00; text-decoration: none;'>$email</a></div>
        </div>
        <div class='row'>
          <div class='label'>Organization:</div>
          <div class='value'>$company</div>
        </div>
        <div class='row'>
          <div class='label'>Domain:</div>
          <div class='value'><span class='badge'>$service</span></div>
        </div>
        <div class='row'>
          <div class='label'>Timeline:</div>
          <div class='value'>$timeline</div>
        </div>
        <div class='row'>
          <div class='label'>Budget:</div>
          <div class='value'>$budget</div>
        </div>
      </div>

      <div class='brief-title'>Project Description &amp; Technical Requirements:</div>
      <div class='brief-box'>$description</div>

      <div class='telemetry'>
        <div><strong>TIMESTAMP:</strong> $timestamp</div>
        <div><strong>CLIENT IP:</strong> $clientIp</div>
        <div><strong>USER AGENT:</strong> $userAgent</div>
      </div>
    </div>
    <div class='footer'>
      TRANSMITTED FROM AL AMEEN N R PORTFOLIO PLATFORM &bull; SYSTEM ID: 0x7F
    </div>
  </div>
</body>
</html>
";

// 2. Client Acknowledgement Email (Sent to Enquirer: $email)
$ack_subject = "Technical Enquiry Received — Al Ameen N R";
$ack_template = "
<!DOCTYPE html>
<html>
<head>
  <meta charset='UTF-8'>
  <style>
    body { margin: 0; padding: 24px; background-color: #0A0A0A; color: #E5E5E5; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif; font-size: 14px; line-height: 1.6; }
    .card { max-width: 620px; margin: 0 auto; background: #111111; border: 1px solid #222222; border-radius: 12px; overflow: hidden; box-shadow: 0 10px 30px rgba(0,0,0,0.5); }
    .header { padding: 26px 30px; background: #161616; border-bottom: 2px solid #C8FF00; }
    .brand { font-family: 'Courier New', Courier, monospace; font-size: 11px; text-transform: uppercase; color: #C8FF00; letter-spacing: 2px; font-weight: bold; margin-bottom: 4px; }
    .header-title { font-size: 20px; font-weight: 700; color: #FFFFFF; margin: 0; }
    .content { padding: 30px; }
    .salutation { font-size: 16px; font-weight: 600; color: #FFFFFF; margin-bottom: 14px; }
    p { margin: 0 0 16px 0; color: #B5B5B5; line-height: 1.6; }
    .steps-card { background: #161616; border-left: 3px solid #C8FF00; padding: 18px 20px; border-radius: 0 8px 8px 0; margin: 20px 0; }
    .steps-card h4 { margin: 0 0 10px 0; font-size: 13px; text-transform: uppercase; letter-spacing: 1px; color: #FFFFFF; font-family: 'Courier New', Courier, monospace; }
    .steps-card ul { margin: 0; padding-left: 18px; color: #CCCCCC; }
    .steps-card li { margin-bottom: 6px; }
    .summary-card { background: #0D0D0D; border: 1px solid #222222; border-radius: 8px; padding: 18px; margin: 20px 0; }
    .summary-title { font-family: 'Courier New', Courier, monospace; font-size: 11px; text-transform: uppercase; color: #888888; letter-spacing: 1px; margin-bottom: 10px; font-weight: bold; }
    .summary-item { font-size: 13px; margin-bottom: 6px; color: #A0A0A0; }
    .summary-item strong { color: #E5E5E5; }
    .reply-box { padding: 14px 18px; background: rgba(200, 255, 0, 0.05); border: 1px solid rgba(200, 255, 0, 0.2); border-radius: 6px; font-size: 13px; color: #C8FF00; margin-top: 24px; }
    .signature { margin-top: 30px; padding-top: 20px; border-top: 1px solid #222222; }
    .sig-name { font-weight: 700; color: #FFFFFF; font-size: 15px; }
    .sig-title { font-size: 12px; color: #777777; font-family: 'Courier New', Courier, monospace; margin-top: 2px; }
    .footer { padding: 18px 30px; background: #0A0A0A; border-top: 1px solid #1A1A1A; font-size: 11px; color: #555555; text-align: center; font-family: 'Courier New', Courier, monospace; }
  </style>
</head>
<body>
  <div class='card'>
    <div class='header'>
      <div class='brand'>AL AMEEN N R &bull; TRANSMISSION ACKNOWLEDGEMENT</div>
      <h1 class='header-title'>Enquiry Received &amp; Queued</h1>
    </div>
    <div class='content'>
      <div class='salutation'>Hello $name,</div>
      <p>Thank you for reaching out. Your project enquiry regarding <strong>$service</strong> has been received and securely queued for evaluation.</p>
      
      <div class='steps-card'>
        <h4>What Happens Next?</h4>
        <ul>
          <li><strong>Architecture &amp; Scope Review:</strong> I will personally review your problem statement, technical requirements, and delivery timeline.</li>
          <li><strong>Direct Response (24–48 Hours):</strong> You will receive a direct reply with preliminary observations, feasibility assessments, or an invitation to a technical scoping call.</li>
          <li><strong>Confidentiality Assurance:</strong> All project specifications, workflows, and business contexts are held with strict professional confidentiality.</li>
        </ul>
      </div>

      <div class='summary-card'>
        <div class='summary-title'>Submitted Specification Copy</div>
        <div class='summary-item'><strong>Service Scope:</strong> $service</div>
        <div class='summary-item'><strong>Organization:</strong> $company</div>
        <div class='summary-item'><strong>Target Timeline:</strong> $timeline</div>
        <div class='summary-item'><strong>Estimated Budget:</strong> $budget</div>
      </div>

      <div class='reply-box'>
        <strong>Need to add artifacts?</strong> If you have technical architecture diagrams, API specs, or security guidelines to share, you can reply directly to this email at any time.
      </div>

      <div class='signature'>
        <div class='sig-name'>Al Ameen N R</div>
        <div class='sig-title'>Security Engineer &bull; Forward Deployed Engineer &bull; Systems Builder</div>
        <div class='sig-title' style='color: #555555; margin-top: 4px;'>Kerala, India &bull; <a href='https://aiameen.online' style='color: #777777;'>aiameen.online</a></div>
      </div>
    </div>
    <div class='footer'>
      AUTOMATED CONFIRMATION DISPATCH &bull; NO MARKETING EMAILS WILL BE SENT
    </div>
  </div>
</body>
</html>
";

// ── Dispatch Both Emails ──────────────────────────────────────────────────────
$admin_sent = deliver_email(
    $ENV,
    $ENV['MAIL_TO'],
    $email, // Reply-to is set to the client
    $admin_subject,
    $admin_template
);

$ack_sent = deliver_email(
    $ENV,
    $email, // Sent to client
    $ENV['MAIL_TO'], // Reply-to is set to Al Ameen
    $ack_subject,
    $ack_template
);

// ── Persistent Logging ────────────────────────────────────────────────────────
$log_entry = json_encode([
    'timestamp'    => $timestamp,
    'lead_name'    => $name,
    'lead_email'   => $email,
    'company'      => $company,
    'service'      => $service,
    'timeline'     => $timeline,
    'budget'       => $budget,
    'admin_sent'   => $admin_sent,
    'ack_sent'     => $ack_sent,
    'client_ip'    => $clientIp,
    'transport'    => $ENV['MAIL_TRANSPORT'],
]) . "\n";

@file_put_contents($ENV['LOG_DIR'] . '/enquiries.jsonl', $log_entry, FILE_APPEND);

// Human-readable dev log
$readable_log = "========== NEW ENQUIRY [{$timestamp}] ==========\n" .
                "From: {$name} <{$email}> ({$company})\n" .
                "Service: {$service} | Timeline: {$timeline} | Budget: {$budget}\n" .
                "Admin Dispatched: " . ($admin_sent ? "YES" : "NO") . "\n" .
                "Client Acknowledgement Dispatched: " . ($ack_sent ? "YES" : "NO") . "\n" .
                "Message:\n{$description}\n\n";

@file_put_contents($ENV['LOG_DIR'] . '/local_mail_log.txt', $readable_log, FILE_APPEND);

// ── Client Response ───────────────────────────────────────────────────────────
http_response_code(200);
echo json_encode([
    "success"     => true,
    "message"     => "Project enquiry successfully dispatched. A confirmation receipt has been sent to {$email}.",
    "admin_sent"  => $admin_sent,
    "ack_sent"    => $ack_sent,
    "reference"   => substr(hash('sha256', $timestamp . $email), 0, 10),
]);
