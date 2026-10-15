-- ─────────────────────────────────────────────────────────────────────────────
--  0004_content_fidelity.sql — fields needed so DB-served content matches the
--  authoring source exactly (takeaways, cheat sheets, pacing, author, etc.).
--
--  Idempotent-ish: the migrator records applied files in `schema_migrations`
--  and ignores MySQL 1060 (duplicate column) so a partially applied file can be
--  re-run. One ALTER per column keeps each addition independently skippable.
-- ─────────────────────────────────────────────────────────────────────────────

SET NAMES utf8mb4;

-- ── courses ─────────────────────────────────────────────────────────────────
ALTER TABLE courses ADD COLUMN author_name VARCHAR(120) NOT NULL DEFAULT '';
ALTER TABLE courses ADD COLUMN author_role VARCHAR(160) NOT NULL DEFAULT '';
ALTER TABLE courses ADD COLUMN author_credentials VARCHAR(255) NOT NULL DEFAULT '';
ALTER TABLE courses ADD COLUMN total_estimated_minutes INT UNSIGNED NOT NULL DEFAULT 0;
ALTER TABLE courses ADD COLUMN last_updated DATE NULL DEFAULT NULL;

-- ── modules ─────────────────────────────────────────────────────────────────
ALTER TABLE modules ADD COLUMN one_page_cheat_sheet TEXT NULL;
ALTER TABLE modules ADD COLUMN required TINYINT(1) NOT NULL DEFAULT 1;

-- ── lessons ─────────────────────────────────────────────────────────────────
ALTER TABLE lessons ADD COLUMN summary_takeaways JSON NULL;
ALTER TABLE lessons ADD COLUMN prerequisites JSON NULL;
ALTER TABLE lessons ADD COLUMN minutes_reading INT UNSIGNED NOT NULL DEFAULT 0;
ALTER TABLE lessons ADD COLUMN minutes_practice INT UNSIGNED NOT NULL DEFAULT 0;
