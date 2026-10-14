# Red Teaming + Blue Teaming: Portfolio Course Specification

## 1. Course overview

**Course title:** Practical Cybersecurity: Red Teaming, Blue Teaming, and Purple Teaming  
**Format:** Self-paced, browser-based learning section within a portfolio application  
**Audience:** Beginners progressing toward intermediate practice  
**Prerequisites:** Basic computer use; no prior security experience required  
**Suggested pacing:** 10–12 weeks at 4–6 hours per week; learners may move at their own pace  
**Access model:** All published lessons, notes, quizzes, and downloadable resources are available to enrolled/visiting students. Progress is personal and saved per learner.  
**Course promise:** Learn how to reason about security from both attacker and defender perspectives, practice only in explicitly authorized labs, and explain findings clearly.

### Learning outcomes
By the end, a learner can:

1. Explain core networking, operating-system, web, identity, and security concepts.
2. Scope an authorized security assessment and follow rules of engagement.
3. Recognize common weaknesses in deliberately vulnerable, isolated practice targets.
4. Describe detection, triage, containment, recovery, and evidence-handling workflows.
5. Map observations to a shared vocabulary such as the MITRE ATT&CK framework without treating a mapping as proof.
6. Write a concise, reproducible finding with impact, evidence, and a practical remediation.
7. Collaborate across red and blue roles to improve a detection or control.

## 2. Course information architecture

```text
Course landing page
├── Start here (orientation, safety, prerequisites, glossary)
├── Curriculum
│   ├── Core foundations (Modules 0–3)
│   ├── Red team track (Modules 4–6)
│   ├── Blue team track (Modules 7–9)
│   └── Purple team capstone (Module 10)
├── Notes & reference (searchable glossary, checklists, cheat sheets)
├── Labs (authorized sandbox instructions and lab status)
├── Assessments (module quizzes and capstone rubric)
├── Resources (downloadable, versioned files)
└── My progress (resume, completion, quiz attempts, certificates/badges if enabled)
```

Each module contains an overview, learning objectives, ordered lessons, notes, one or more knowledge checks, and a completion rule. A lesson may contain explanatory text, diagrams, a safe demonstration, a lab, a short quiz, and references. Course navigation must not require a learner to remember a previous URL.

## 3. Curriculum map

### Module 0 — Orientation, ethics, and safe practice
**Purpose:** Set expectations and establish safe boundaries before technical work.

- 0.1 How to use this course; learning paths and estimated effort
- 0.2 Authorization, scope, rules of engagement, and stop conditions
- 0.3 Safe lab environments, synthetic data, and responsible disclosure basics
- 0.4 Evidence handling, privacy, and professional communication
- **Practice:** Review a sample engagement scope and mark allowed, prohibited, and unclear actions.
- **Completion:** Safety check (all critical authorization questions correct) and scope exercise.

### Module 1 — Computing, networks, and the command line
- 1.1 Files, processes, users, permissions, and services
- 1.2 IP addresses, ports, DNS, routing, and common protocols
- 1.3 HTTP request/response concepts, TLS purpose, and browser developer tools
- 1.4 Shell navigation and text processing in a local practice environment
- **Practice:** Read a provided network diagram and interpret synthetic request logs.
- **Assessment:** Label core network concepts and explain a simple HTTP exchange.

### Module 2 — Security foundations and threat thinking
- 2.1 Confidentiality, integrity, availability; assets and trust boundaries
- 2.2 Threat, vulnerability, likelihood, impact, and risk
- 2.3 Authentication, authorization, sessions, and least privilege
- 2.4 Security controls: preventive, detective, and corrective
- 2.5 Threat modeling a fictional portfolio web app
- **Practice:** Build a small threat model from a supplied diagram; propose controls.

### Module 3 — Web, identity, and application security basics
- 3.1 How browsers, servers, APIs, and databases fit together
- 3.2 Input handling, output encoding, access-control concepts, and secure defaults
- 3.3 Password storage concepts, MFA, session safety, and account recovery
- 3.4 Common weakness categories and how to prevent them (conceptual overview)
- 3.5 Dependency, configuration, and secrets-management fundamentals
- **Practice:** Inspect a deliberately simplified code snippet and identify defensive improvements.

### Module 4 — Red team foundations: plan and observe
- 4.1 Red team, penetration test, vulnerability assessment, and simulation: differences
- 4.2 Define objectives, scope, exclusions, contacts, timing, and stop conditions
- 4.3 Reconnaissance concepts using a fictional organization and supplied data
- 4.4 Hypothesis-driven testing and evidence minimization
- 4.5 Mapping behaviors to ATT&CK as a communication aid
- **Practice:** Turn a fictional brief into a test plan; no public targets or real credential collection.

### Module 5 — Red team assessment in a contained lab
- 5.1 Set up or enter the course-provided isolated target; verify the lab boundary
- 5.2 Review a prebuilt asset inventory and identify test hypotheses
- 5.3 Analyze supplied scan results rather than scanning arbitrary systems
- 5.4 Validate a finding safely in the intentionally vulnerable target
- 5.5 Record evidence, assess impact, and recommend remediation
- **Practice:** Complete a guided, resettable lab with synthetic accounts and data.
- **Deliverable:** One finding card using the reporting template below.

### Module 6 — Red team reporting and professional practice
- 6.1 Finding quality: title, severity rationale, evidence, impact, reproduction, fix
- 6.2 Risk ratings, uncertainty, and avoiding exaggerated claims
- 6.3 Debrief, retest, and remediation verification
- 6.4 Responsible disclosure and data minimization
- **Practice:** Improve a weak sample report and explain what evidence is still missing.

### Module 7 — Blue team foundations: telemetry and detection
- 7.1 Security operations roles and alert lifecycle
- 7.2 Logs, events, timestamps, normalization, and data quality
- 7.3 Endpoint, identity, network, and application telemetry (concepts)
- 7.4 Detection logic: signal, context, false positives, and coverage gaps
- 7.5 ATT&CK-informed detection planning and limitations
- **Practice:** Analyze a supplied, sanitized event timeline and identify useful follow-up questions.

### Module 8 — Blue team operations: triage and response
- 8.1 Alert triage, prioritization, and escalation
- 8.2 Incident response lifecycle: prepare, detect, analyze, contain, eradicate, recover, learn
- 8.3 Evidence preservation, chain of custody concepts, and privacy
- 8.4 Containment trade-offs and business communication
- 8.5 Recovery validation and post-incident actions
- **Practice:** Tabletop scenario with branching decisions and synthetic logs.

### Module 9 — Blue team resilience and improvement
- 9.1 Secure configuration, patching, asset inventory, and backups
- 9.2 Identity hardening, MFA, least privilege, and access reviews
- 9.3 Vulnerability management and remediation prioritization
- 9.4 Metrics that support learning (coverage, time-to-triage, recurrence)
- 9.5 Detection tuning and purple-team feedback loops
- **Practice:** Prioritize a mock remediation backlog using risk and operational context.

### Module 10 — Purple team capstone
**Scenario:** A fictional company authorizes a limited assessment in a provided sandbox. Students work through both perspectives using a fixed dataset and resettable lab.

- Part A: Confirm scope and identify assets and objectives.
- Part B: Review a controlled set of observations and validate one seeded weakness.
- Part C: Inspect the associated synthetic telemetry and write a detection hypothesis.
- Part D: Recommend a corrective control and a validation plan.
- Part E: Present an executive summary and a technical finding.

**Capstone deliverables:** Scope checklist, one finding, one detection improvement, one remediation verification plan, and a short reflection on limitations.  
**Rubric:** Safety/scope (required pass), technical reasoning, evidence quality, impact and remediation, clarity, and collaboration. Require a passing safety/scope score regardless of overall score.

## 4. Lesson content and notes standard

Every lesson should use a consistent, accessible structure:

1. **Title and estimate** (reading, practice, and total time)
2. **Why this matters** (plain-language context)
3. **Objectives** (2–5 observable actions)
4. **Prerequisites** and links to earlier lessons
5. **Core explanation** (short sections, examples, diagrams with text alternatives)
6. **Key terms** with plain-language definitions
7. **Worked example** using fictional or synthetic data
8. **Practice or lab** with explicit scope, setup, reset, and expected result
9. **Knowledge check** with feedback for every answer
10. **Summary / key takeaways**
11. **References** with title, publisher, URL, and last-reviewed date
12. **Mark complete** action and next/previous lesson navigation

Keep notes modular: each lesson is a standalone page, with a downloadable print-friendly version. Provide a searchable course glossary and a one-page reference sheet per module. Clearly label optional enrichment so it does not block the main path. Avoid unexplained abbreviations; expand them on first use.

### Reusable lesson template
```yaml
id: red-05-04
module_id: red-05
slug: validate-a-finding-safely
title: Validate a finding safely
estimated_minutes: 25
level: beginner
objectives:
  - Explain the permitted validation boundary
  - Interpret the supplied lab evidence
prerequisites: [red-05-01, core-00-02]
sections:
  - type: explanation
    title: What validation means
    body: "..."
  - type: example
    dataset: synthetic-lab-evidence-v1
  - type: lab
    environment: isolated-course-sandbox
    reset_available: true
    scope_notice: "Use only the assigned course target. Stop if the target or scope differs."
  - type: quiz
    quiz_id: red-05-04-check
completion:
  rule: learner_marks_complete
resources: [finding-template-v1]
```


## 5. Student experience and navigation

### Landing page
Show the course title, short description, audience/prerequisites, estimated effort, outcomes, safety statement, instructor/author attribution, course outline, accessibility/contact route, and a clear **Start learning** or **Resume course** button. State whether access is open or requires sign-in. Do not imply accreditation unless it exists.

### Course player
- Persistent course navigation with modules, lesson titles, completion icons, and current lesson.
- On small screens, navigation becomes a labelled drawer; it must be operable with keyboard and screen reader.
- Previous/Next controls, breadcrumb, lesson position (for example, “Lesson 3 of 6”), and a “Back to course” link.
- Search across lesson titles, notes, glossary, and resource descriptions; results deep-link to the relevant section.
- Keep the lesson body in a readable single column with an optional contents list for long lessons.
- Indicate required versus optional content and prerequisite state. Explain any locked item and how to unlock it.
- Preserve the learner’s last location and restore it on return.

### Progress and completion
- Save progress per authenticated learner; for guests, either offer local device-only progress or explain that it will not sync.
- Completion is explicit per lesson; quiz score is separate from lesson completion.
- Show module and course progress from completed required lessons, with the denominator visible (for example, “8 of 12 required lessons”).
- Allow learners to revisit completed content and retake quizzes. Keep best score and latest attempt separately if useful.
- Provide a reset control with a clear confirmation for progress reset; never reset silently.
- Completion badge/certificate is optional. If implemented, state its criteria and avoid representing it as a professional certification.

## 6. Content and data model

Recommended entities (adapt to the app’s existing backend):

- **Course:** id, slug, title, summary, description, version, status, audience, prerequisites, estimated_minutes, outcomes, author, published_at.
- **Module:** id, course_id, slug, title, summary, order_index, required, objectives.
- **Lesson:** id, module_id, slug, title, order_index, estimated_minutes, level, body/content blocks, prerequisites, required, published_at, version.
- **Resource:** id, title, description, type, URL/storage key, file size, version, license, accessibility notes.
- **Quiz / Question:** id, lesson_id or module_id, question, choices, correct answer, explanation, order_index. Keep answer keys private from client delivery where feasible.
- **Enrollment / LearnerProgress:** learner_id, course_id, lesson_id, state (`not_started`, `in_progress`, `completed`), last_position, completed_at, updated_at.
- **QuizAttempt:** learner_id, quiz_id, score, answers or privacy-minimized result, attempt_number, created_at.
- **LabSession:** learner_id, lab_id, state, started_at, expires_at, reset_count; store only what is needed to operate the sandbox.

Use stable IDs and slugs, explicit ordering, content versioning, and draft/published status. Keep course content data separate from presentation so new modules do not require custom page code. If a database is not available, a versioned content manifest can support a static course; explain that progress is local-only unless a backend is added.

## 7. Labs and downloadable resources

### Lab safety requirements
- Use only an isolated, intentionally vulnerable course environment or supplied offline dataset.
- Never direct students to test public systems, other students’ devices, or real accounts.
- Use synthetic identities and data; prohibit real personal data and real credentials.
- Provide a visible scope notice, start/reset/stop controls, time limits, and a way to report a broken lab.
- Isolate lab networking from the public internet and other learners where applicable; use disposable environments and least privilege.
- Log only operationally necessary events, protect those logs, set retention limits, and do not expose one learner’s activity to another.
- Make every lab’s expected boundaries and prohibited actions explicit. Pause the lab if the environment does not match the instructions.

### Resource library
Include, at minimum:
- Course glossary (HTML first; optional accessible PDF)
- Scope and rules-of-engagement checklist
- Threat-model worksheet
- Finding/report template
- Incident triage worksheet
- Incident response tabletop worksheet
- Remediation prioritization sheet
- Capstone brief and rubric
- Module summaries and references

Downloads should include clear filenames, version/date, license or reuse terms, file type, and size. Prefer accessible HTML/Markdown and tagged PDFs; do not make a PDF the only way to read required content.

## 8. Quiz and assessment design

- Use short formative checks throughout; explain why an answer is right or wrong.
- Mix multiple choice, matching, ordering, and short scenario responses. Do not make trivia the primary measure.
- Randomize question order only when it does not undermine scenario meaning.
- Keep the answer key off public page source/API payload when practical; validate scoring server-side if scores matter.
- Support retries and show topic-level feedback. Do not punish a learner for exploring or revisiting content.
- Suggested module threshold: 70% for a “passed” indicator, with unlimited retakes; safety module requires all critical boundary questions correct.
- Capstone graded against the published rubric; provide actionable feedback and a resubmission path.

## 9. Responsive UI, accessibility, and quality

- Design mobile-first; support narrow screens, zoom/reflow, touch targets, and landscape use.
- Use semantic headings, landmarks, buttons, lists, labels, and form errors. Ensure full keyboard operation and visible focus.
- Meet WCAG 2.2 AA as the target: sufficient contrast, text resize, meaningful link text, captions/transcripts for media, and no color-only status cues.
- Add text alternatives for diagrams; provide transcripts/captions for video/audio. Avoid timed assessments unless accommodations are possible.
- Respect reduced motion and avoid autoplay. Keep progress feedback understandable to assistive technology.
- Use plain language and define technical terms. Offer light/dark themes only if both preserve contrast.
- Validate with automated accessibility checks plus keyboard and screen-reader review before release.

## 10. Security, privacy, and publishing

- Enforce authorization on server endpoints for learner records, quiz results, and lab sessions; never trust a client-supplied learner ID.
- Keep secrets and answer keys out of public client bundles and source control. Use managed secrets for integrations.
- Sanitize/render lesson content safely; if rich text or Markdown is supported, prevent script injection and unsafe embeds.
- Validate uploads and downloads, use safe content types, and restrict file access according to course access policy.
- Apply rate limits to sign-in, quiz submission, and lab controls. Use secure session handling and standard account protections.
- Collect the minimum personal data needed. Publish what is stored, why, who can see it, retention, and how a learner can request deletion.
- Keep lab infrastructure separate from the portfolio site and production data. Do not run learner-supplied code on the portfolio server.
- Draft content, preview, then publish; preserve version history and provide a way to correct stale references.

## 11. Suggested routes and page states

```text
/courses/teaming                         landing
/courses/teaming/start                   orientation
/courses/teaming/modules/:moduleSlug     module overview
/courses/teaming/lessons/:lessonSlug     lesson player
/courses/teaming/resources               resource library
/courses/teaming/glossary                searchable glossary
/courses/teaming/progress                learner progress
/courses/teaming/capstone                brief, submission, rubric
```

Required states: loading, no progress, in progress, completed, locked prerequisite, unavailable lab, failed save, offline/read-only if supported, and not found. Show a recoverable message when progress cannot be saved and retain the current lesson locally until retry where feasible.

## 12. Definition of done for implementation

- Course is reachable from the portfolio’s main navigation and has a complete landing page.
- All modules, lessons, notes, quizzes, labs, and listed resources are linked from the course structure.
- Learners can navigate, search, resume, mark lessons complete, retake quizzes, and view accurate progress.
- Progress and assessment data are scoped to the correct learner and protected by server-side authorization.
- The experience works on mobile and desktop, supports keyboard navigation, and has accessible text alternatives.
- Lab boundaries, reset behavior, privacy, and reporting path are visible before a lab starts.
- Empty/error/loading states exist; content can be updated without hand-editing page layout code.
- References and downloadable files have version/date information and are checked before publishing.

## 13. Build prompt for a portfolio app coding assistant

> Add a complete “Practical Cybersecurity: Red Teaming, Blue Teaming, and Purple Teaming” course section to this existing portfolio application. First inspect the app’s framework, routing, design system, authentication, storage, and current content patterns; reuse them. Build a responsive landing page, course navigation/player, searchable lesson and glossary content, resource library, quizzes, learner progress/resume, completion states, and the 11-module curriculum in this specification. Store course content as structured, versioned data rather than hard-coded page-specific markup. Protect learner progress and answer keys with the app’s existing server-side authorization patterns. Include accessible loading, error, locked, empty, and completed states. Use fictional examples, synthetic datasets, and isolated resettable labs only; show authorization and scope requirements before lab entry. Do not add real-target attack instructions or run student code on the portfolio server. Add or adapt persistence only to the degree supported by the existing app, and clearly indicate when progress is device-local. Follow the repository’s conventions and report the files changed and any infrastructure still needed.
