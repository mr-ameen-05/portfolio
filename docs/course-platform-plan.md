# Cybersecurity Course Platform — Build Plan

Status: **draft for review** (no code written yet)
Decisions locked: real accounts in PHP/MySQL · DB-backed editable content · plan-before-code

> **Deferred to a future release (NOT in the current build):** paid live sessions and the
> purchase/checkout flow (Razorpay). Everything commerce-related in this document is kept
> only as a forward plan and is explicitly out of scope for now.

---

## 1. Scope and guiding constraints

Turn the existing portfolio course area (`/courses/teaming`) into a real learning
platform matching the product plan: public preview, registered access, and enrolled
access. Paid live sessions are a **future** addition, not part of this build.

Hard constraints (from the product plan):

- Professional-development framing only. No promised job, certification, or outcome.
- Authorized, isolated labs only; synthetic data; never target real systems.
- Learner records and gated content protected by **server-side** authorization.
- Course content is **structured data, editable without rebuilding page layouts**.
- Accessible, mobile-friendly, keyboard-usable, clear loading/empty/locked/error states.
- **No payment integration in the current build.**

---

## 2. Decisions (and why)

| Area | Decision | Rationale |
|---|---|---|
| Identity | Email + password, `password_hash()` (Argon2id/bcrypt), DB-backed sessions | Fits existing PHP/MySQL backend; no vendor; needed for real tiers |
| Payments | **Deferred to a future release** (Razorpay hosted checkout planned) | Purchase feature is not needed in the current build |
| Content store | MySQL tables + JSON/Markdown per lesson | Enables editing without rebuild, versioning, tier gating |
| Session transport | HttpOnly + Secure + SameSite=Lax cookie, same-origin API | Avoids CORS-with-credentials complexity; CSRF token for writes |
| Progress | Server-authoritative, local cache + offline queue | Survives device changes; matches "server-side authorization" |
| Repo layout | Generalize `src/courses/teaming` → `src/courses/*` + `src/platform/` | Support a catalog of courses, not one hard-coded course |

### Current-build access tiers (course only)

- **Public** — catalog, overview, syllabus, sample lesson, sample quiz, instructor, FAQ.
- **Registered** — free account: intro lessons, glossary, sample assessments.
- **Enrolled** — full lessons, labs, notes, assessments, progress, capstone.
- *(Future)* **Paid session** — a separate purchase; not built now.

---

## 3. Data model (new MySQL tables)

Add to `deploy/mysql/schema.sql` (idempotent `CREATE TABLE IF NOT EXISTS`) and a
new `deploy/mysql/migrations/` folder applied by `deploy.sh`.

### Identity & access *(current build)*
- `users` — `id`, `email` (UNIQUE), `password_hash`, `name`, `role` ENUM(`learner`,`instructor`,`admin`), `email_verified_at`, `status` ENUM(`active`,`disabled`), `created_at`, `last_login_at`
- `sessions` — `id`, `user_id`, `token_hash` (CHAR(64)), `csrf_token`, `ip`, `user_agent`, `expires_at`, `created_at`
- `email_tokens` — `id`, `user_id`, `purpose` ENUM(`verify_email`,`reset_password`), `token_hash`, `expires_at`, `used_at`
- `entitlements` — `id`, `user_id`, `product_type` ENUM(`course`), `product_id`, `tier` ENUM(`registered`,`enrolled`), `source` ENUM(`free`,`admin`,`grant`), `granted_at`, `expires_at` NULL — **the single source of truth for access**

### Content (editable without rebuild) *(current build)*
- `courses` — `id`, `slug` UNIQUE, `title`, `summary`, `description`, `version`, `status` ENUM(`draft`,`published`), `estimated_weeks`, `hours_per_week`, `audience`, `prerequisites` JSON, `outcomes` JSON, `safety_statement`, `published_at`, `updated_at`
- `course_phases` — `id`, `course_id`, `position`, `title`, `description`
- `modules` — `id`, `course_id`, `phase_id`, `position`, `slug`, `title`, `track` ENUM(`core`,`red`,`blue`,`purple`), `access_tier` ENUM(`public`,`registered`,`enrolled`)
- `lessons` — `id`, `module_id`, `position`, `slug` UNIQUE, `title`, `required`, `estimated_minutes`, `access_tier`, `objectives` JSON, `key_terms` JSON, `sections` JSON (typed blocks), `references` JSON, `last_reviewed_at`, `updated_at`
- `quizzes` — `id`, `scope` ENUM(`lesson`,`module`), `scope_id`, `passing_score`, `requires_safety_pass`, `access_tier`
- `quiz_questions` — `id`, `quiz_id`, `position`, `prompt`, `choices` JSON, `correct_index` (**never sent to client**), `explanation`, `critical`
- `resources` — migrated from `src/courses/teaming/data/resourcesData.ts` (`id`, `course_id`, `title`, `description`, `type`, `version`, `license`, `content_md`, `access_tier`)
- `glossary_terms` — migrated from `glossaryData.ts` (`id`, `term`, `acronym`, `definition`, `track`, `related_lesson_slugs` JSON)

### Progress & assessment *(current build)*
- `lesson_progress` — `user_id`, `lesson_id`, `completed`, `completed_at` (PK `user_id,lesson_id`)
- `lab_states` — `user_id`, `lab_id`, `completed`, `draft` JSON, `updated_at`
- `quiz_attempts` — **extend existing** with `user_id` (keep `learner_id` for legacy/anon)
- `capstone_submissions` — `id`, `user_id`, `course_id`, `status` ENUM(`draft`,`submitted`,`reviewed`), `content` JSON, `rubric` JSON, `reviewer_id`, `review_notes`, `submitted_at`, `reviewed_at`
- `certificates` — `id`, `user_id`, `course_id`, `serial` UNIQUE, `criteria` JSON (snapshot), `issued_at`

### Commerce — **FUTURE, not in the current build**
Kept here only as a forward plan. Do **not** create these tables now.
- `live_sessions`, `orders`, `order_items`, `webhook_events`

---

## 4. API surface (`api/`)

All endpoints reuse `bootstrap.php`. New shared libs loaded there.

### New shared libs
- `lib/Auth.php` — `current_user()`, `login()`, `logout()`, `require_auth()`, `require_role()`, `require_tier($productType,$productId,$tier)`, session create/verify, CSRF issue/check
- `lib/Validator.php` — email/password/name/int validation
- `lib/Migrator.php` — apply `deploy/mysql/migrations/*.sql` once (tracked in `schema_migrations`)

### Auth *(current build)*
- `POST auth/register.php` · `POST auth/login.php` · `POST auth/logout.php` · `GET auth/me.php`
- `POST auth/verify-email.php` · `POST auth/request-reset.php` · `POST auth/reset-password.php`

### Public catalog (no auth) *(current build)*
- `GET courses/index.php` — published courses
- `GET courses/show.php?slug=` — overview + syllabus + access labels (strips any `enrolled`-only body)

### Content (tier-authorized, server-side) *(current build)*
- `GET content/modules.php?course=` — phases/modules/lesson index filtered by tier
- `GET content/lesson.php?slug=` — lesson body **only if** `require_tier` passes
- `GET content/quiz.php?id=` — questions **without** `correct_index`
- `POST content/quiz-submit.php` — server grading (replaces `course-quiz.php`), records attempt + token
- `GET content/resources.php` · `GET content/glossary.php`

### Progress (auth) *(current build)*
- `GET progress/index.php` · `POST progress/lesson.php` · `POST progress/lab.php` · `GET progress/summary.php`

### Commerce (Razorpay) — **FUTURE, not in the current build**
- `sessions/*`, `checkout/*`, `webhooks/razorpay.php`, `orders/*` — build later.

### Admin (Release 3)
- `admin/courses.php`, `admin/modules.php`, `admin/lessons.php`, `admin/quizzes.php` — CRUD, `require_role('admin'|'instructor')`

### Deprecations
- `course-quiz.php` → superseded by `content/quiz-submit.php` (keep a shim during migration)
- `course-enroll.php` → becomes an entitlement grant path, no longer the access gate

---

## 5. Frontend structure

```
src/
  platform/                      # shared, course-agnostic
    api/client.ts                # fetch wrapper: credentials:'include', CSRF, errors
    auth/AuthContext.tsx         # session bootstrap via /auth/me
    auth/RequireAuth.tsx         # <RequireAuth> and <RequireTier tier=...>
    ui/                          # LoadingState, EmptyState, LockedState, ErrorState
    access/AccessBadge.tsx       # public / registered / enrolled labels
  features/
    catalog/CatalogPage.tsx
    course/CourseOverviewPage.tsx  (public: syllabus, sample lesson, instructor, FAQ)
    auth/{Login,Register,VerifyEmail,ResetPassword,Account}Page.tsx
    dashboard/DashboardPage.tsx
    learn/{ModulePage,LessonPage,QuizPage,LabPage}.tsx
    progress/ProgressPage.tsx
    capstone/{CapstoneSubmit,CapstoneReview}.tsx
  courses/<slug>/                # content-shaped components, no hard-coded copy
  data/ (existing, temporary fallback snapshot for offline/SEO)
```

### Routing (react-router v6)
- Public: `/courses`, `/courses/:slug`, `/courses/:slug/lessons/:lessonSlug` (public-tier)
- Auth: `/login`, `/register`, `/verify`, `/reset`, `/account`
- Gated: `/dashboard`, `/courses/:course/modules/:moduleId`, `/.../lessons/:slug`, `/.../quiz/:id`, `/.../lab/:id`, `/.../capstone`, `/progress`
- Keep `/courses/teaming` working (redirect into the new structure) so existing links/SEO survive.
- *(Future)* `/sessions`, `/checkout/:sessionId`, `/orders/:id`

### Access-tier matrix (current build)

| Surface | Public | Registered | Enrolled |
|---|---|---|---|
| Catalog, course overview, syllabus | ✓ | ✓ | ✓ |
| Sample lesson + sample quiz | ✓ | ✓ | ✓ |
| Intro lessons, glossary | — | ✓ | ✓ |
| Full lessons, labs, assessments | — | — | ✓ |
| Progress, capstone, certificate | — | — | ✓ |

Paid live sessions add a separate purchase tier in a later release (see §6).

Guards are **defense-in-depth**: UI hides/blurs, but the API enforces `require_tier` on every payload.

---

## 6. Payments flow (Razorpay) — **DEFERRED, not in the current build**

This entire section is a forward plan only. No checkout, orders, or payment keys in
this build.

When it is added (future release):
1. Learner opens a session → `POST checkout/order.php` → server creates a Razorpay order, records `orders`/`order_items` (`status=created`), returns `order_id` + public key.
2. Razorpay Checkout modal (hosted) collects payment — card data never reaches us.
3. On success → `POST checkout/verify.php` verifies HMAC → `status=paid` → grants `entitlements`.
4. `POST webhooks/razorpay.php` reconciles asynchronously; `webhook_events.event_id` UNIQUE makes it idempotent.
5. Show receipt + enrollment status; send access details only to the entitled user.

Pre-checkout the page must display: title & goals, instructor + bio, date/start/timezone/duration, price + what it includes, prerequisites + software, seat availability, cancellation/reschedule/refund policy, whether a recording is provided, accessibility contact.

Env (later, in `api/.env`, never committed): `RAZORPAY_KEY_ID`, `RAZORPAY_KEY_SECRET`, `RAZORPAY_WEBHOOK_SECRET`.

---

## 7. Content pipeline (editable without rebuild)

- **Migrate** current TS data → MySQL via a one-time seeder: a Node script reads `src/courses/teaming/data/*` and emits JSON; `api/tools/seed_content.php` imports it inside a transaction.
- **Serve** content from the API (`content/*.php`), tier-filtered.
- **Edit** in Release 3 via `admin/*` CRUD (or SQL/JSON import until then).
- **Fallback**: keep a build-time JSON snapshot in `src/data/` for offline/SEO and graceful degradation if the API is unreachable.
- Lesson `sections` is a typed block array so layouts render generically (text, diagram, example, lab, quiz, callout) and new lessons need no code change.

---

## 8. Security checklist

- [ ] Argon2id `password_hash`; constant-time `password_verify`; no user enumeration in login/reset responses
- [ ] Sessions: random 256-bit token, stored **hashed**, HttpOnly+Secure+SameSite=Lax cookie, sliding expiry, revoke on logout/password change
- [ ] CSRF token required on all state-changing requests
- [ ] `require_tier` on **every** content/progress/quiz endpoint (not just UI)
- [ ] Quiz `correct_index` never serialized to the client
- [ ] Reuse `RateLimiter` on auth and quiz endpoints
- [ ] Parameterized queries only (PDO) — already the pattern
- [ ] CORS stays same-origin; no wildcard with credentials
- [ ] Email verification + password reset tokens hashed, single-use, expiring
- *(Future, when payments are added)* money as integer minor units; Razorpay signature + webhook verified; idempotent webhooks

---

## 9. Accessibility, i18n, SEO

- Semantic headings/landmarks; visible focus; full keyboard operation; `aria-live` for form/loading states.
- Do not use color alone for access/locked status — add text + icon.
- Captions/transcripts for any recorded sessions (later); text descriptions for diagrams.
- Meaningful form errors tied to fields.
- Public pages (`/courses`, overview) get `<title>`/meta + `sitemap.xml`/`robots.txt` entries; consider pre-rendering the public catalog for SEO (SPA caveat).

---

## 10. Phased delivery

### Release 1 — Foundations (accounts + tiers + public course)
1. Migrations: `users`, `sessions`, `email_tokens`, `entitlements`, content tables, `lesson_progress`, `lab_states`.
2. `lib/Auth.php`, `lib/Validator.php`, `lib/Migrator.php`; wire into `bootstrap.php`; expand `RateLimiter` scopes.
3. Auth endpoints + `features/auth/*` pages + `AuthContext` + `RequireAuth`/`RequireTier`.
4. `content` seeder + migrate weeks 1–3 (Modules 0–3) into DB.
5. Public catalog (`/courses`) + course overview/syllabus + sample lesson.
6. Tier-aware lesson API + server-persisted progress (replace localStorage as source of truth; keep cache).
7. Tests + PHP lint + `tsc` + build.

### Release 2 — Practice content
8. Red/Blue modules wired to tiers; resource library + glossary from DB; assessments.
9. Progress dashboard + assessment polish.
10. Captions/transcripts scaffolding; accessibility pass.

### Release 3 — Capstone, certificates, admin
11. Capstone submission + rubric + instructor review queue.
12. Certificates with transparent, snapshotted criteria.
13. Admin content CRUD (no-rebuild editing), analytics, support/help workflow, error reporting.

### Future — Live sessions & payments (not scheduled here)
- `live_sessions` schedule, Razorpay checkout/verify/webhook, receipts, entitlements,
  payment/refund policy page, captions for recordings.

---

## 11. Migration & deploy

- `deploy.sh` gains a `migrate` step calling `lib/Migrator.php` (or `mysql < deploy/mysql/migrations/*.sql`), tracked in `schema_migrations`.
- One-time data seed after first migrate.
- New env keys documented in `deploy/api.env.example` and `api/.env.example` (no secrets committed).
- `DEPLOYMENT.md` updated: schema, migrations, cron for expiring tokens. (Razorpay keys/webhook are added later, with payments.)

---

## 12. Open questions / risks

1. **Payments deferred:** purchase/live-session checkout is out of scope for the current build; Razorpay KYC/keys will be needed when it is added later.
2. **Same-origin API** assumed (current `/api`). If the API moves to `api.aiameen.online`, cookies need `SameSite=None; Secure` + exact CORS origin + credentials.
3. **Content source of truth**: once in DB, editing happens in DB/admin — decide whether TS files stay as seed only.
4. **SEO** on an SPA: public catalog may want pre-render/SSR.
5. **Existing `learner_id`** localStorage progress: offer a one-time "link this device's progress to your account" on first login.
6. **Stray repo files** noticed (unrelated): `scratch.ts`, `vite.config.js`, `vite.config.d.ts`, `tailwind.config.ts`, `tailwind.config.d.ts`, root `robots.txt`/`sitemap.xml`, `Sprite action/*.png~` — candidates for cleanup, confirm before deleting.

---

## 13. Verification plan

- PHP: `php -l` on all new files; `Migrator` dry-run; seed in a transaction then roll back.
- API smoke tests (curl) for register → login → tier-gated lesson 200/403 → quiz grade → progress write.
- Frontend: `tsc -b` clean, `npm run build`, manual keyboard/axe pass on auth + catalog pages.
- Authorization matrix test: each tier × each surface must return the expected allow/deny.

---

## 14. Suggested file-level task list (Release 1)

**Backend**
- `api/lib/Auth.php`, `api/lib/Validator.php`, `api/lib/Migrator.php`
- `api/auth/{register,login,logout,me,verify-email,request-reset,reset-password}.php`
- `api/courses/{index,show}.php`
- `api/content/{modules,lesson,quiz,quiz-submit,resources,glossary}.php`
- `api/progress/{index,lesson,lab,summary}.php`
- `api/tools/seed_content.php`
- `deploy/mysql/migrations/0001_identity.sql`, `0002_content.sql`, `0003_progress.sql`
- `api/.env.example` (+ `deploy/api.env.example`) updates

**Frontend**
- `src/platform/api/client.ts`, `src/platform/auth/{AuthContext,RequireAuth}.tsx`, `src/platform/ui/*`, `src/platform/access/AccessBadge.tsx`
- `src/features/catalog/CatalogPage.tsx`, `src/features/course/CourseOverviewPage.tsx`
- `src/features/auth/*`
- `src/features/learn/{ModulePage,LessonPage,QuizPage}.tsx`
- `src/features/dashboard/DashboardPage.tsx`, `src/features/progress/ProgressPage.tsx`
- Router changes in `src/App.tsx`; redirects for existing `/courses/teaming/*`

---

## 15. What I need from you before Release 1 code

1. Approve this plan (or mark changes).
2. Confirm the API stays **same-origin** (`/api`) for now.
3. Confirm **`entitlements`** as the single access source of truth (course tiers: registered/enrolled).
4. Whether to keep the existing `/courses/teaming` URLs as redirects (recommended).
5. Confirm paid live sessions / purchase stay **out of the current build** (yes, per your update).
