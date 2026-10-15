-- ─────────────────────────────────────────────────────────────────────────────
--  0003_progress.sql — learner progress, lab state, capstone, certificates
--  Extends the pre-existing quiz_attempts table (created by schema.sql).
--  The ALTER is guarded by the Migrator, which ignores duplicate-column/index
--  errors so this file is safe to re-run.
-- ─────────────────────────────────────────────────────────────────────────────

SET NAMES utf8mb4;

-- Attach server-side quiz attempts to a real account (legacy rows keep learner_id).
ALTER TABLE quiz_attempts
    ADD COLUMN user_id BIGINT UNSIGNED NULL DEFAULT NULL AFTER id,
    ADD KEY idx_quiz_user (user_id);

CREATE TABLE IF NOT EXISTS lesson_progress (
    user_id      BIGINT UNSIGNED NOT NULL,
    lesson_id    BIGINT UNSIGNED NOT NULL,
    completed    TINYINT(1)      NOT NULL DEFAULT 1,
    completed_at DATETIME        NOT NULL DEFAULT CURRENT_TIMESTAMP,
    PRIMARY KEY (user_id, lesson_id),
    KEY idx_lesson_progress_lesson (lesson_id),
    CONSTRAINT fk_lp_user   FOREIGN KEY (user_id)   REFERENCES users (id)    ON DELETE CASCADE,
    CONSTRAINT fk_lp_lesson FOREIGN KEY (lesson_id) REFERENCES lessons (id)  ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

CREATE TABLE IF NOT EXISTS lab_states (
    user_id    BIGINT UNSIGNED NOT NULL,
    lab_id     VARCHAR(120)    NOT NULL,
    completed  TINYINT(1)      NOT NULL DEFAULT 0,
    draft      JSON            NULL,
    updated_at DATETIME        NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    PRIMARY KEY (user_id, lab_id),
    CONSTRAINT fk_lab_user FOREIGN KEY (user_id) REFERENCES users (id) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

CREATE TABLE IF NOT EXISTS capstone_submissions (
    id           BIGINT UNSIGNED NOT NULL AUTO_INCREMENT,
    user_id      BIGINT UNSIGNED NOT NULL,
    course_id    BIGINT UNSIGNED NOT NULL,
    status       ENUM('draft','submitted','reviewed') NOT NULL DEFAULT 'draft',
    content      JSON            NULL,
    rubric       JSON            NULL,
    reviewer_id  BIGINT UNSIGNED NULL DEFAULT NULL,
    review_notes TEXT            NULL,
    submitted_at DATETIME        NULL DEFAULT NULL,
    reviewed_at  DATETIME        NULL DEFAULT NULL,
    created_at   DATETIME        NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at   DATETIME        NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    PRIMARY KEY (id),
    UNIQUE KEY uniq_capstone_user_course (user_id, course_id),
    KEY idx_capstone_status (status),
    CONSTRAINT fk_capstone_user   FOREIGN KEY (user_id)     REFERENCES users (id)    ON DELETE CASCADE,
    CONSTRAINT fk_capstone_course FOREIGN KEY (course_id)   REFERENCES courses (id)  ON DELETE CASCADE,
    CONSTRAINT fk_capstone_review FOREIGN KEY (reviewer_id) REFERENCES users (id)    ON DELETE SET NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

CREATE TABLE IF NOT EXISTS certificates (
    id           BIGINT UNSIGNED NOT NULL AUTO_INCREMENT,
    user_id      BIGINT UNSIGNED NOT NULL,
    course_id    BIGINT UNSIGNED NOT NULL,
    serial       CHAR(32)        NOT NULL,
    criteria     JSON            NULL,
    issued_at    DATETIME        NOT NULL DEFAULT CURRENT_TIMESTAMP,
    PRIMARY KEY (id),
    UNIQUE KEY uniq_certificates_serial (serial),
    KEY idx_certificates_user (user_id, course_id),
    CONSTRAINT fk_certificates_user   FOREIGN KEY (user_id)   REFERENCES users (id)   ON DELETE CASCADE,
    CONSTRAINT fk_certificates_course FOREIGN KEY (course_id) REFERENCES courses (id) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
