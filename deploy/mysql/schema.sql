-- ─────────────────────────────────────────────────────────────────────────────
--  aiameen.online — MySQL schema
--  Applied by deploy.sh after the database and user are created.
--  Safe to run repeatedly (IF NOT EXISTS).
-- ─────────────────────────────────────────────────────────────────────────────

SET NAMES utf8mb4;

-- Contact form submissions ("mailing system")
CREATE TABLE IF NOT EXISTS contact_messages (
    id          BIGINT UNSIGNED NOT NULL AUTO_INCREMENT,
    name        VARCHAR(120)    NOT NULL,
    email       VARCHAR(190)    NOT NULL,
    subject     VARCHAR(160)    NOT NULL DEFAULT '',
    message     TEXT            NOT NULL,
    ip          VARCHAR(45)     NOT NULL DEFAULT '',
    user_agent  VARCHAR(255)    NOT NULL DEFAULT '',
    mail_sent   TINYINT(1)      NOT NULL DEFAULT 0,
    created_at  DATETIME        NOT NULL DEFAULT CURRENT_TIMESTAMP,
    PRIMARY KEY (id),
    KEY idx_contact_created (created_at),
    KEY idx_contact_email (email)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- Course enrollment gate
CREATE TABLE IF NOT EXISTS course_enrollments (
    id           BIGINT UNSIGNED NOT NULL AUTO_INCREMENT,
    learner_id   VARCHAR(64)     NOT NULL DEFAULT '',
    name         VARCHAR(120)    NOT NULL,
    email        VARCHAR(190)    NOT NULL,
    ip           VARCHAR(45)     NOT NULL DEFAULT '',
    user_agent   VARCHAR(255)    NOT NULL DEFAULT '',
    enrolled_at  DATETIME        NOT NULL DEFAULT CURRENT_TIMESTAMP,
    mail_sent    TINYINT(1)      NOT NULL DEFAULT 0,
    PRIMARY KEY (id),
    UNIQUE KEY uniq_enrollment_email (email),
    KEY idx_enrollment_learner (learner_id),
    KEY idx_enrollment_created (enrolled_at)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- Server-side quiz grading audit trail
CREATE TABLE IF NOT EXISTS quiz_attempts (
    id                 BIGINT UNSIGNED NOT NULL AUTO_INCREMENT,
    learner_id         VARCHAR(64)     NOT NULL DEFAULT '',
    quiz_id            VARCHAR(64)     NOT NULL,
    score              TINYINT UNSIGNED NOT NULL DEFAULT 0,
    passed             TINYINT(1)      NOT NULL DEFAULT 0,
    safety_failed      TINYINT(1)      NOT NULL DEFAULT 0,
    verification_token CHAR(64)        NOT NULL DEFAULT '',
    ip                 VARCHAR(45)     NOT NULL DEFAULT '',
    created_at         DATETIME        NOT NULL DEFAULT CURRENT_TIMESTAMP,
    PRIMARY KEY (id),
    KEY idx_quiz_learner (learner_id, quiz_id),
    KEY idx_quiz_created (created_at)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
