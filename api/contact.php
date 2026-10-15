<?php
/**
 * POST /api/contact.php
 * Contact form → stored in MySQL + emailed to the site owner.
 *
 * Response: { "success": true }  (200) or { "error": "..." } (4xx/5xx)
 */

declare(strict_types=1);

require __DIR__ . '/bootstrap.php';

require_post();
RateLimiter::check('contact');

$data    = read_json();
$name    = trim((string) ($data['name'] ?? ''));
$email   = trim((string) ($data['email'] ?? ''));
$subject = trim((string) ($data['subject'] ?? 'Portfolio inquiry'));
$message = trim((string) ($data['message'] ?? ''));

if ($name === '' || $email === '' || $message === '') {
    json_out(400, ['error' => 'Name, email and message are required.']);
}
if (!filter_var($email, FILTER_VALIDATE_EMAIL)) {
    json_out(400, ['error' => 'Please provide a valid email address.']);
}
if (mb_strlen($name) > 120 || mb_strlen($subject) > 160 || mb_strlen($message) > 5000) {
    json_out(400, ['error' => 'Your message is too long.']);
}

$ip = client_ip();
$ua = user_agent();
$stored = false;
$recordId = null;

if (Database::isAvailable()) {
    try {
        $stmt = Database::pdo()->prepare(
            'INSERT INTO contact_messages (name, email, subject, message, ip, user_agent, created_at)
             VALUES (:name, :email, :subject, :message, :ip, :ua, NOW())'
        );
        $stmt->execute([
            ':name'    => $name,
            ':email'   => $email,
            ':subject' => $subject,
            ':message' => $message,
            ':ip'      => $ip,
            ':ua'      => $ua,
        ]);
        $recordId = (int) Database::pdo()->lastInsertId();
        $stored = true;
    } catch (Throwable $e) {
        app_log('error', ['where' => 'contact.insert', 'msg' => $e->getMessage()]);
    }
}

$html = EmailTemplate::render('NEW CONNECTION', [
    ['label' => 'Name',    'value' => $name],
    ['label' => 'Email',   'value' => $email],
    ['label' => 'Topic',   'value' => $subject],
    ['label' => 'Message', 'value' => $message, 'mono' => true],
], 'Sent from the contact form on aiameen.online');

$sent = Mailer::send(
    'Portfolio Inquiry: ' . $subject,
    $html,
    ['reply_to_name' => $name, 'reply_to_email' => $email]
);

if ($stored && $recordId !== null) {
    try {
        $upd = Database::pdo()->prepare('UPDATE contact_messages SET mail_sent = :sent WHERE id = :id');
        $upd->execute([':sent' => $sent ? 1 : 0, ':id' => $recordId]);
    } catch (Throwable $e) {
        app_log('error', ['where' => 'contact.update', 'msg' => $e->getMessage()]);
    }
}

if (!$stored && !$sent) {
    json_out(502, ['error' => 'The message could not be delivered. Please email me directly.']);
}

json_out(200, [
    'success' => true,
    'message' => 'Message received. Thank you!',
]);
