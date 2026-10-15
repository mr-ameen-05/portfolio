<?php
declare(strict_types=1);

/**
 * Sends notification email through SMTP (PHPMailer) with a fallback to the
 * local PHP mail() transport. The result is always logged to the `mail`
 * channel so nothing is silently lost.
 *
 * SMTP is strongly recommended on AWS: EC2 blocks outbound port 25 by default.
 */
final class Mailer
{
    /**
     * @param array{to?:string, reply_to_name?:string, reply_to_email?:string} $options
     */
    public static function send(string $subject, string $html, array $options = []): bool
    {
        $to = $options['to'] ?? (string) env('MAIL_TO', '');
        if ($to === '') {
            app_log('mail', ['error' => 'no recipient configured', 'subject' => $subject]);
            return false;
        }

        $transport = strtolower((string) env('MAIL_TRANSPORT', 'mail'));
        $sent = false;

        if ($transport === 'smtp') {
            $sent = self::sendSmtp($to, $subject, $html, $options);
        }
        if (!$sent) {
            $sent = self::sendNative($to, $subject, $html, $options);
        }

        app_log('mail', [
            'to'        => $to,
            'subject'   => $subject,
            'transport' => $transport,
            'sent'      => $sent,
        ]);

        return $sent;
    }

    private static function sendSmtp(string $to, string $subject, string $html, array $options): bool
    {
        $autoload = API_ROOT . '/vendor/autoload.php';
        if (!is_file($autoload)) {
            app_log('mail', ['warning' => 'PHPMailer not installed (run composer install); falling back to mail()']);
            return false;
        }
        require_once $autoload;

        $phpmailerClass = 'PHPMailer\\PHPMailer\\PHPMailer';
        if (!class_exists($phpmailerClass)) {
            return false;
        }

        try {
            $mail = new $phpmailerClass(true);
            $mail->isSMTP();
            $mail->Host    = (string) env('SMTP_HOST', '');
            $mail->Port    = env_int('SMTP_PORT', 587);
            $mail->Timeout = 15;
            $mail->CharSet = 'UTF-8';

            $user = (string) env('SMTP_USER', '');
            $mail->SMTPAuth = $user !== '';
            if ($mail->SMTPAuth) {
                $mail->Username = $user;
                $mail->Password = (string) env('SMTP_PASS', '');
            }

            $encryption = strtolower((string) env('SMTP_ENCRYPTION', 'tls'));
            if ($encryption === 'ssl') {
                $mail->SMTPSecure = $phpmailerClass::ENCRYPTION_SMTPS;
            } elseif ($encryption === 'tls') {
                $mail->SMTPSecure = $phpmailerClass::ENCRYPTION_STARTTLS;
            }

            $mail->SMTPDebug = env_int('SMTP_DEBUG', 0);
            $mail->setFrom((string) env('MAIL_FROM_EMAIL', 'no-reply@localhost'), (string) env('MAIL_FROM_NAME', 'Website'));
            $mail->addAddress($to);

            if (!empty($options['reply_to_email'])) {
                $mail->addReplyTo($options['reply_to_email'], $options['reply_to_name'] ?? '');
            }

            $mail->isHTML(true);
            $mail->Subject = $subject;
            $mail->Body    = $html;
            $mail->AltBody = trim(strip_tags($html));

            $mail->send();
            return true;
        } catch (Throwable $e) {
            app_log('mail', ['error' => 'smtp: ' . $e->getMessage()]);
            return false;
        }
    }

    private static function sendNative(string $to, string $subject, string $html, array $options): bool
    {
        $fromEmail = (string) env('MAIL_FROM_EMAIL', 'no-reply@localhost');
        $fromName  = (string) env('MAIL_FROM_NAME', 'Website');

        $headers  = "MIME-Version: 1.0\r\n";
        $headers .= "Content-Type: text/html; charset=UTF-8\r\n";
        $headers .= "From: $fromName <$fromEmail>\r\n";
        if (!empty($options['reply_to_email'])) {
            $replyName = $options['reply_to_name'] ?? '';
            $headers  .= 'Reply-To: ' . ($replyName !== '' ? "$replyName <{$options['reply_to_email']}>" : $options['reply_to_email']) . "\r\n";
        }
        $headers .= 'X-Mailer: PHP/' . phpversion();

        return @mail($to, $subject, $html, $headers);
    }
}
