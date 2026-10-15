<?php
/**
 * POST /api/course-enroll.php
 * Records a course enrollment in MySQL and notifies the site owner.
 *
 * Request:  { "name": "...", "email": "...", "learner_id": "...", "enrolled_at": 1234567890 }
 * Response: { "success": true, "message": "...", "enrolled_at": 1234567890 }
 */

declare(strict_types=1);

require __DIR__ . '/bootstrap.php';

require_post();
RateLimiter::check('enroll');

$data    = read_json();
$name    = trim((string) ($data['name'] ?? ''));
$email   = trim((string) ($data['email'] ?? ''));
$learner = trim((string) ($data['learner_id'] ?? 'unknown-learner'));
$enrolledUnix = isset($data['enrolled_at']) && is_numeric($data['enrolled_at'])
    ? (int) $data['enrolled_at']
    : time();

if ($name === '' || $email === '') {
    json_out(400, ['error' => 'Name and email are required.']);
}
if (!filter_var($email, FILTER_VALIDATE_EMAIL)) {
    json_out(400, ['error' => 'Please provide a valid email address.']);
}
if (mb_strlen($name) > 120) {
    json_out(400, ['error' => 'Name is too long.']);
}
$learner = mb_substr($learner, 0, 64);

$ip = client_ip();
$ua = user_agent();
$stored = false;

if (Database::isAvailable()) {
    try {
        // One row per email; keep the newest name/learner details on re-enroll.
        $stmt = Database::pdo()->prepare(
            'INSERT INTO course_enrollments (learner_id, name, email, ip, user_agent, enrolled_at, created_at)
             VALUES (:learner, :name, :email, :ip, :ua, FROM_UNIXTIME(:enrolled_at), NOW())
             ON DUPLICATE KEY UPDATE
                learner_id = VALUES(learner_id),
                name       = VALUES(name),
                ip         = VALUES(ip),
                user_agent = VALUES(user_agent),
                enrolled_at = VALUES(enrolled_at)'
        );
        $stmt->execute([
            ':learner'     => $learner,
            ':name'        => $name,
            ':email'       => $email,
            ':ip'          => $ip,
            ':ua'          => $ua,
            ':enrolled_at' => $enrolledUnix,
        ]);
        $stored = true;
    } catch (Throwable $e) {
        app_log('error', ['where' => 'enroll.insert', 'msg' => $e->getMessage()]);
    }
}

$html = EmailTemplate::render('NEW COURSE ENROLLMENT', [
    ['label' => 'Name',       'value' => $name],
    ['label' => 'Email',      'value' => $email],
    ['label' => 'Course',     'value' => 'Practical Cybersecurity: Red, Blue & Purple Teaming'],
    ['label' => 'Learner ID', 'value' => $learner],
    ['label' => 'Enrolled At', 'value' => gmdate('Y-m-d H:i:s', $enrolledUnix) . ' UTC'],
    ['label' => 'Technical Context', 'value' => "IP: $ip\nUser-Agent: $ua", 'mono' => true],
], 'Sent from the course enrollment gate on aiameen.online');

$sent = Mailer::send(
    'Course Enrollment: Practical Cybersecurity (Teaming)',
    $html,
    ['reply_to_name' => $name, 'reply_to_email' => $email]
);

if ($stored) {
    try {
        $upd = Database::pdo()->prepare(
            'UPDATE course_enrollments SET mail_sent = :sent WHERE email = :email'
        );
        $upd->execute([':sent' => $sent ? 1 : 0, ':email' => $email]);
    } catch (Throwable $e) {
        app_log('error', ['where' => 'enroll.update', 'msg' => $e->getMessage()]);
    }
}

// Always succeed for the learner so the gate never blocks (matches prior behaviour).
json_out(200, [
    'success'     => true,
    'message'     => 'Enrollment recorded successfully',
    'enrolled_at' => $enrolledUnix,
    'persisted'   => $stored,
]);
