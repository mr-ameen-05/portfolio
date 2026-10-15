-- ─────────────────────────────────────────────────────────────────────────────
--  0001_identity.sql — accounts, sessions, email tokens, entitlements
--  Applied by api/lib/Migrator.php (tracked in schema_migrations).
--  Idempotent: CREATE TABLE IF NOT EXISTS.
-- ─────────────────────────────────────────────────────────────────────────────

SET NAMES utf8mb4;

CREATE TABLE IF NOT EXISTS users (
    id                BIGINT UNSIGNED NOT NULL AUTO_INCREMENT,
    email             VARCHAR(190)    NOT NULL,
    password_hash     VARCHAR(255)    NOT NULL,
    name              VARCHAR(120)    NOT NULL,
    role              ENUM('learner','instructor','admin') NOT NULL DEFAULT 'learner',
    status            ENUM('active','disabled')            NOT NULL DEFAULT 'active',
    email_verified_at DATETIME        NULL DEFAULT NULL,
    created_at        DATETIME        NOT NULL DEFAULT CURRENT_TIMESTAMP,
    last_login_at     DATETIME        NULL DEFAULT NULL,
    PRIMARY KEY (id),
    UNIQUE KEY uniq_users_email (email),
    KEY idx_users_role (role)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

CREATE TABLE IF NOT EXISTS sessions (
    id         BIGINT UNSIGNED NOT NULL AUTO_INCREMENT,
    user_id    BIGINT UNSIGNED NOT NULL,
    token_hash CHAR(64)        NOT NULL,
    csrf_token CHAR(64)        NOT NULL,
    ip         VARCHAR(45)     NOT NULL DEFAULT '',
    user_agent VARCHAR(255)    NOT NULL DEFAULT '',
    expires_at DATETIME        NOT NULL,
    created_at DATETIME        NOT NULL DEFAULT CURRENT_TIMESTAMP,
    PRIMARY KEY (id),
    UNIQUE KEY uniq_sessions_token (token_hash),
    KEY idx_sessions_user (user_id),
    KEY idx_sessions_expires (expires_at),
    CONSTRAINT fk_sessions_user FOREIGN KEY (user_id) REFERENCES users (id) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

CREATE TABLE IF NOT EXISTS email_tokens (
    id         BIGINT UNSIGNED NOT NULL AUTO_INCREMENT,
    user_id    BIGINT UNSIGNED NOT NULL,
    purpose    ENUM('verify_email','reset_password') NOT NULL,
    token_hash CHAR(64)        NOT NULL,
    expires_at DATETIME        NOT NULL,
    used_at    DATETIME        NULL DEFAULT NULL,
    created_at DATETIME        NOT NULL DEFAULT CURRENT_TIMESTAMP,
    PRIMARY KEY (id),
    UNIQUE KEY uniq_email_tokens_token (token_hash),
    KEY idx_email_tokens_user (user_id, purpose),
    CONSTRAINT fk_email_tokens_user FOREIGN KEY (user_id) REFERENCES users (id) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- Single source of truth for what a learner may access.
CREATE TABLE IF NOT EXISTS entitlements (
    id           BIGINT UNSIGNED NOT NULL AUTO_INCREMENT,
    user_id      BIGINT UNSIGNED NOT NULL,
    product_type ENUM('course')                 NOT NULL DEFAULT 'course',
    product_id   VARCHAR(64)                    NOT NULL,
    tier         ENUM('registered','enrolled')  NOT NULL,
    source       ENUM('free','admin','grant')   NOT NULL DEFAULT 'free',
    granted_at   DATETIME                       NOT NULL DEFAULT CURRENT_TIMESTAMP,
    expires_at   DATETIME                       NULL DEFAULT NULL,
    PRIMARY KEY (id),
    UNIQUE KEY uniq_entitlement (user_id, product_type, product_id),
    KEY idx_entitlements_user (user_id),
    CONSTRAINT fk_entitlements_user FOREIGN KEY (user_id) REFERENCES users (id) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
