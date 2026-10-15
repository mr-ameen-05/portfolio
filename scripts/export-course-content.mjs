#!/usr/bin/env node
/**
 * Exports the authoring-source course content (TypeScript under
 * src/courses/teaming/data) into a single JSON snapshot that the PHP seeder
 * (api/tools/seed_content.php) loads into MySQL.
 *
 * The TS files stay the source of truth for authoring; this script bridges
 * them into the database so content can later be edited without a rebuild.
 *
 * Usage:  node scripts/export-course-content.mjs
 * Output: deploy/content/course-teaming.json
 */
import { spawnSync } from 'node:child_process';
import { createRequire } from 'node:module';
import fs from 'node:fs';
import os from 'node:os';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const here = path.dirname(fileURLToPath(import.meta.url));
const root = path.resolve(here, '..');
const outFile = path.join(root, 'deploy', 'content', 'course-teaming.json');
const buildDir = path.join(os.tmpdir(), 'oc-content-build');

// ── 1. Compile the data modules to CommonJS ─────────────────────────────────
const tsc = path.join(root, 'node_modules', '.bin', 'tsc');
const inputs = [
  'src/courses/teaming/data/modulesManifest.ts',
  'src/courses/teaming/data/courseMetadata.ts',
  'src/courses/teaming/data/resourcesData.ts',
  'src/courses/teaming/data/glossaryData.ts',
];

fs.rmSync(buildDir, { recursive: true, force: true });
const compile = spawnSync(
  tsc,
  [
    ...inputs,
    '--outDir', buildDir,
    '--module', 'commonjs',
    '--target', 'es2020',
    '--moduleResolution', 'node',
    '--esModuleInterop',
    '--skipLibCheck',
    '--rootDir', 'src/courses/teaming',
  ],
  { cwd: root, encoding: 'utf8' }
);
if (compile.status !== 0) {
  console.error(compile.stdout || '', compile.stderr || '');
  process.exit(1);
}

const require = createRequire(import.meta.url);
const dataDir = path.join(buildDir, 'data');
const { COURSE_METADATA } = require(path.join(dataDir, 'courseMetadata.js'));
const { COURSE_RESOURCES } = require(path.join(dataDir, 'resourcesData.js'));
const { GLOSSARY_ITEMS } = require(path.join(dataDir, 'glossaryData.js'));
const { ALL_MODULES } = require(path.join(dataDir, 'modulesManifest.js'));

// ── 2. Access tiers: preview → registered → enrolled ────────────────────────
function moduleTier(orderIndex) {
  if (orderIndex <= 0) return 'public';
  if (orderIndex <= 2) return 'registered';
  return 'enrolled';
}
function resourceTier(type) {
  return type === 'glossary' ? 'public' : 'registered';
}

// ── 3. Shape the snapshot ───────────────────────────────────────────────────
const quizzes = [];
const modules = ALL_MODULES
  .slice()
  .sort((a, b) => a.orderIndex - b.orderIndex)
  .map((mod) => {
    const tier = moduleTier(mod.orderIndex);

    if (mod.moduleQuiz) {
      quizzes.push(mapQuiz(mod.moduleQuiz, 'module', mod.slug));
    }

    return {
      slug: mod.slug,
      title: mod.title,
      track: mod.track,
      sort_order: mod.orderIndex,
      access_tier: tier,
      summary: mod.summary,
      objectives: mod.objectives ?? [],
      lessons: mod.lessons.map((lesson) => ({
        slug: lesson.slug,
        title: lesson.title,
        sort_order: lesson.orderIndex,
        required: lesson.required !== false,
        estimated_minutes: lesson.estimatedMinutes?.total ?? 0,
        access_tier: tier,
        objectives: lesson.objectives ?? [],
        key_terms: lesson.keyTerms ?? [],
        sections: lesson.sections ?? [],
        refs: lesson.references ?? [],
        last_reviewed_at: null,
        // Retained for future endpoints (search, previews).
        why_this_matters: lesson.whyThisMatters ?? '',
        level: lesson.level ?? 'beginner',
        version: lesson.version ?? '1.0.0',
        published_at: lesson.publishedAt ?? null,
      })),
    };
  });

function mapQuiz(quiz, scope, scopeId) {
  return {
    scope,
    scope_id: scopeId,
    title: quiz.title ?? '',
    passing_score: quiz.passingScore ?? 70,
    requires_safety_pass: quiz.requiresSafetyPass ? 1 : 0,
    questions: (quiz.questions ?? []).map((q) => ({
      key: q.id,
      prompt: q.question,
      choices: q.choices,
      correct_index: q.correctIndex ?? 0,
      explanation: q.explanation ?? '',
      critical: q.isCriticalSafety ? 1 : 0,
    })),
  };
}

const snapshot = {
  generated_at: new Date().toISOString(),
  course: {
    slug: COURSE_METADATA.slug,
    title: COURSE_METADATA.title,
    summary: COURSE_METADATA.summary,
    description: COURSE_METADATA.description,
    version: COURSE_METADATA.version,
    status: COURSE_METADATA.status,
    audience: COURSE_METADATA.audience ?? '',
    estimated_weeks: COURSE_METADATA.estimatedWeeks ?? '',
    hours_per_week: COURSE_METADATA.estimatedHoursPerWeek ?? '',
    prerequisites: COURSE_METADATA.prerequisites ?? [],
    outcomes: COURSE_METADATA.outcomes ?? [],
    safety_statement: COURSE_METADATA.safetyStatement ?? '',
    published_at: COURSE_METADATA.publishedAt ?? null,
  },
  modules,
  quizzes,
  resources: COURSE_RESOURCES.map((r) => ({
    key: r.id,
    title: r.title,
    description: r.description,
    type: r.type,
    file_format: r.fileFormat,
    version: r.version,
    license: r.license,
    content_md: r.contentMarkdown,
    access_tier: resourceTier(r.type),
  })),
  glossary: GLOSSARY_ITEMS.map((g) => ({
    key: g.id,
    term: g.term,
    acronym: g.acronym ?? '',
    definition: g.definition,
    track: g.track,
    related_slugs: g.relatedLessonSlugs ?? [],
  })),
};

// ── 4. Write ────────────────────────────────────────────────────────────────
fs.mkdirSync(path.dirname(outFile), { recursive: true });
fs.writeFileSync(outFile, JSON.stringify(snapshot, null, 2) + '\n');

const lessonCount = modules.reduce((n, m) => n + m.lessons.length, 0);
console.log(
  `Wrote ${path.relative(root, outFile)} — ` +
  `${modules.length} modules, ${lessonCount} lessons, ${quizzes.length} quizzes, ` +
  `${snapshot.resources.length} resources, ${snapshot.glossary.length} glossary terms.`
);
