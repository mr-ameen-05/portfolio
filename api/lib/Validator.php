<?php
declare(strict_types=1);

/**
 * Input validation helpers shared by the auth and content endpoints.
 * Every method returns null when the value is valid, or a display-ready
 * error string when it is not.
 */
final class Validator
{
    public static function email(?string $value): ?string
    {
        $value = trim((string) $value);
        if ($value === '') {
            return 'Please enter your email address.';
        }
        if (strlen($value) > 190) {
            return 'That email address is too long.';
        }
        if (!filter_var($value, FILTER_VALIDATE_EMAIL)) {
            return 'Please enter a valid email address.';
        }
        return null;
    }

    public static function name(?string $value): ?string
    {
        $value = trim((string) $value);
        if ($value === '') {
            return 'Please enter your name.';
        }
        if (mb_strlen($value) < 2) {
            return 'Name must be at least 2 characters.';
        }
        if (mb_strlen($value) > 120) {
            return 'Name must be 120 characters or fewer.';
        }
        return null;
    }

    public static function password(?string $value): ?string
    {
        $value = (string) $value;
        if ($value === '') {
            return 'Please choose a password.';
        }
        if (strlen($value) < 10) {
            return 'Password must be at least 10 characters.';
        }
        if (strlen($value) > 200) {
            return 'Password is too long.';
        }
        if (!preg_match('/[A-Za-z]/', $value) || !preg_match('/\d/', $value)) {
            return 'Password must include at least one letter and one number.';
        }
        return null;
    }

    public static function token(?string $value): ?string
    {
        $value = trim((string) $value);
        if ($value === '' || strlen($value) !== 64 || !ctype_xdigit($value)) {
            return 'This link is invalid or has expired.';
        }
        return null;
    }
}
