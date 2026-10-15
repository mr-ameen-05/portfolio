-- ─────────────────────────────────────────────────────────────────────────────
--  0002_content.sql — courses, phases, modules, lessons, quizzes, resources, glossary
--  Content is stored as structured data so lessons can be edited without a rebuild.
--  Idempotent: CREATE TABLE IF NOT EXISTS.
-- ─────────────────────────────────────────────────────────────────────────────

SET NAMES utf8mb4;

CREATE TABLE IF NOT EXISTS courses (
    id                BIGINT UNSIGNED NOT NULL AUTO_INCREMENT,
    slug              VARCHAR(80)     NOT NULL,
    title             VARCHAR(200)    NOT NULL,
    summary           TEXT            NOT NULL,
    description       MEDIUMTEXT      NOT NULL,
    version           VARCHAR(20)     NOT NULL DEFAULT '1.0.0',
    status            ENUM('draft','published') NOT NULL DEFAULT 'draft',
    audience          VARCHAR(255)    NOT NULL DEFAULT '',
    estimated_weeks   VARCHAR(40)     NOT NULL DEFAULT '',
    hours_per_week    VARCHAR(40)     NOT NULL DEFAULT '',
    prerequisites     JSON            NULL,
    outcomes          JSON            NULL,
    safety_statement  TEXT            NULL,
    published_at      DATETIME        NULL DEFAULT NULL,
    created_at        DATETIME        NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at        DATETIME        NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    PRIMARY KEY (id),
    UNIQUE KEY uniq_courses_slug (slug)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

CREATE TABLE IF NOT EXISTS course_phases (
    id          BIGINT UNSIGNED NOT NULL AUTO_INCREMENT,
    course_id   BIGINT UNSIGNED NOT NULL,
    sort_order  INT UNSIGNED    NOT NULL DEFAULT 0,
    title       VARCHAR(200)    NOT NULL,
    description TEXT            NULL,
    PRIMARY KEY (id),
    KEY idx_phases_course (course_id, sort_order),
    CONSTRAINT fk_phases_course FOREIGN KEY (course_id) REFERENCES courses (id) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

CREATE TABLE IF NOT EXISTS modules (
    id          BIGINT UNSIGNED NOT NULL AUTO_INCREMENT,
    course_id   BIGINT UNSIGNED NOT NULL,
    phase_id    BIGINT UNSIGNED NULL DEFAULT NULL,
    sort_order  INT UNSIGNED    NOT NULL DEFAULT 0,
    slug        VARCHAR(120)    NOT NULL,
    title       VARCHAR(200)    NOT NULL,
    summary     TEXT            NULL,
    objectives  JSON            NULL,
    track       ENUM('core','red','blue','purple') NOT NULL DEFAULT 'core',
    access_tier ENUM('public','registered','enrolled') NOT NULL DEFAULT 'enrolled',
    PRIMARY KEY (id),
    UNIQUE KEY uniq_modules_slug (slug),
    KEY idx_modules_course (course_id, sort_order),
    KEY idx_modules_phase (phase_id),
    CONSTRAINT fk_modules_course FOREIGN KEY (course_id) REFERENCES courses (id) ON DELETE CASCADE,
    CONSTRAINT fk_modules_phase  FOREIGN KEY (phase_id)  REFERENCES course_phases (id) ON DELETE SET NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

CREATE TABLE IF NOT EXISTS lessons (
    id                BIGINT UNSIGNED NOT NULL AUTO_INCREMENT,
    module_id         BIGINT UNSIGNED NOT NULL,
    sort_order        INT UNSIGNED    NOT NULL DEFAULT 0,
    slug              VARCHAR(140)    NOT NULL,
    title             VARCHAR(200)    NOT NULL,
    required          TINYINT(1)      NOT NULL DEFAULT 1,
    estimated_minutes INT UNSIGNED    NOT NULL DEFAULT 0,
    access_tier       ENUM('public','registered','enrolled') NOT NULL DEFAULT 'enrolled',
    why_this_matters  TEXT            NULL,
    level             ENUM('beginner','intermediate') NOT NULL DEFAULT 'beginner',
    version           VARCHAR(20)     NOT NULL DEFAULT '1.0.0',
    objectives        JSON            NULL,
    key_terms         JSON            NULL,
    sections          JSON            NULL,
    refs              JSON            NULL,
    last_reviewed_at  DATE            NULL DEFAULT NULL,
    published_at      DATE            NULL DEFAULT NULL,
    created_at        DATETIME        NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at        DATETIME        NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    PRIMARY KEY (id),
    UNIQUE KEY uniq_lessons_slug (slug),
    KEY idx_lessons_module (module_id, sort_order),
    CONSTRAINT fk_lessons_module FOREIGN KEY (module_id) REFERENCES modules (id) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

CREATE TABLE IF NOT EXISTS quizzes (
    id                  BIGINT UNSIGNED NOT NULL AUTO_INCREMENT,
    scope               ENUM('lesson','module') NOT NULL DEFAULT 'module',
    scope_id            VARCHAR(140)    NOT NULL,
    title               VARCHAR(200)    NOT NULL DEFAULT '',
    passing_score       TINYINT UNSIGNED NOT NULL DEFAULT 70,
    requires_safety_pass TINYINT(1)     NOT NULL DEFAULT 0,
    access_tier         ENUM('public','registered','enrolled') NOT NULL DEFAULT 'enrolled',
    created_at          DATETIME        NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at          DATETIME        NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    PRIMARY KEY (id),
    UNIQUE KEY uniq_quizzes_scope (scope, scope_id)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

CREATE TABLE IF NOT EXISTS quiz_questions (
    id            BIGINT UNSIGNED NOT NULL AUTO_INCREMENT,
    quiz_id       BIGINT UNSIGNED NOT NULL,
    question_key  VARCHAR(64)     NOT NULL,
    sort_order    INT UNSIGNED    NOT NULL DEFAULT 0,
    prompt        TEXT            NOT NULL,
    choices       JSON            NOT NULL,
    correct_index SMALLINT        NOT NULL,
    explanation   TEXT            NULL,
    critical      TINYINT(1)      NOT NULL DEFAULT 0,
    PRIMARY KEY (id),
    UNIQUE KEY uniq_question_key (quiz_id, question_key),
    KEY idx_questions_quiz (quiz_id, sort_order),
    CONSTRAINT fk_questions_quiz FOREIGN KEY (quiz_id) REFERENCES quizzes (id) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

CREATE TABLE IF NOT EXISTS resources (
    id          BIGINT UNSIGNED NOT NULL AUTO_INCREMENT,
    course_id   BIGINT UNSIGNED NULL DEFAULT NULL,
    resource_key VARCHAR(80)    NOT NULL,
    title       VARCHAR(200)    NOT NULL,
    description TEXT            NULL,
    type        VARCHAR(40)     NOT NULL DEFAULT 'template',
    file_format VARCHAR(80)     NOT NULL DEFAULT '',
    version     VARCHAR(20)     NOT NULL DEFAULT '',
    license     VARCHAR(120)    NOT NULL DEFAULT '',
    content_md  MEDIUMTEXT      NULL,
    access_tier ENUM('public','registered','enrolled') NOT NULL DEFAULT 'registered',
    PRIMARY KEY (id),
    UNIQUE KEY uniq_resources_key (resource_key),
    KEY idx_resources_course (course_id),
    CONSTRAINT fk_resources_course FOREIGN KEY (course_id) REFERENCES courses (id) ON DELETE SET NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

CREATE TABLE IF NOT EXISTS glossary_terms (
    id            BIGINT UNSIGNED NOT NULL AUTO_INCREMENT,
    term_key      VARCHAR(120)    NOT NULL,
    term          VARCHAR(160)    NOT NULL,
    acronym       VARCHAR(40)     NOT NULL DEFAULT '',
    definition    TEXT            NOT NULL,
    track         ENUM('core','red','blue','purple','general') NOT NULL DEFAULT 'general',
    related_slugs JSON            NULL,
    PRIMARY KEY (id),
    UNIQUE KEY uniq_glossary_key (term_key),
    KEY idx_glossary_term (term)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
