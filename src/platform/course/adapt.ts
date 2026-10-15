/**
 * Adapter: maps API payloads (snake_case) into the existing local types
 * (camelCase) used by the course UI. Pure functions, no side effects.
 */
import type {
  ApiCourse,
  ApiLessonFull,
  ApiLessonMeta,
  ApiLessonSection,
  ApiModule,
  ApiQuiz,
  ApiQuizQuestion,
  ApiResource,
  ApiGlossaryItem,
  ApiProgress,
  ApiQuizSubmitResult,
} from './types';
import type {
  ModuleData,
  Lesson,
  LessonSection,
  QuizData,
  QuizQuestion,
  WorkedExample,
  ContainedLab,
  CourseMetadata,
  ResourceItem,
  GlossaryItem,
  LearnerProgress,
  KeyTerm,
  LessonReference,
} from '../../courses/teaming/types/course.types';

const COURSE_SLUG = 'teaming';

function splitMinutes(total: number, reading: number, practice: number): { reading: number; practice: number; total: number } {
  if (reading > 0 && practice > 0) return { reading, practice, total: reading + practice };
  if (total <= 0) return { reading: 0, practice: 0, total: 0 };
  const r = Math.round(total * 0.7);
  return { reading: r, practice: total - r, total };
}

function adaptKeyTerms(api: { term: string; acronym?: string; definition: string }[]): KeyTerm[] {
  return api.map(k => ({ term: k.term, acronym: k.acronym, definition: k.definition }));
}

function adaptReferences(api: { title: string; publisher: string; url: string; last_reviewed: string }[]): LessonReference[] {
  return api.map(r => ({ title: r.title, publisher: r.publisher, url: r.url, lastReviewed: r.last_reviewed }));
}

function adaptQuizQuestions(api: ApiQuizQuestion[]): QuizQuestion[] {
  return api.map(q => ({
    id: q.key,
    question: q.prompt,
    choices: q.choices,
    correctIndex: undefined, // never shipped to client
    explanation: '', // server returns explanation in grade result
    isCriticalSafety: q.critical,
  }));
}

function adaptLessonSection(s: ApiLessonSection): LessonSection {
  const base = { type: s.type, title: s.title };
  switch (s.type) {
    case 'explanation':
      return { ...base, content: s.content ?? '' };
    case 'diagram':
      return { ...base, diagramAscii: s.diagram_ascii, diagramAltText: s.diagram_alt_text };
    case 'example':
      if (s.example_data) {
        const e = s.example_data;
        return {
          ...base,
          exampleData: {
            title: e.title,
            datasetName: e.dataset_name,
            scenario: e.scenario,
            syntheticData: e.synthetic_data,
            analysisWalkthrough: e.analysis_walkthrough,
            keyInsight: e.key_insight,
          },
        };
      }
      return base;
    case 'lab':
      if (s.lab_data) {
        const l = s.lab_data;
        return {
          ...base,
          labData: {
            id: l.id,
            title: l.title,
            environmentName: l.environment_name,
            scopeNotice: l.scope_notice,
            allowedActions: l.allowed_actions,
            prohibitedActions: l.prohibited_actions,
            stopConditions: l.stop_conditions,
            initialState: l.initial_state,
            instructions: l.instructions,
            expectedResult: l.expected_result,
            labType: l.lab_type as ContainedLab['labType'],
          },
        };
      }
      return base;
    case 'quiz':
      if (s.quiz_data) {
        const q = s.quiz_data as { id: string; title: string; passing_score: number; requires_safety_pass?: boolean; questions: ApiQuizQuestion[] };
        return { ...base, quizData: {
          id: q.id,
          title: q.title,
          passingScore: q.passing_score,
          requiresSafetyPass: q.requires_safety_pass,
          questions: adaptQuizQuestions(q.questions),
          scope: 'lesson',
          scopeId: '', // lesson quiz scope ID not tracked in API
        }};
      }
      return base;
    default:
      return base;
  }
}

/** Map a full lesson (unlocked) from the bundle into a local Lesson. */
export function adaptLessonFull(api: ApiLessonFull, moduleSlug: string): Lesson {
  const mins = splitMinutes(api.estimated_minutes, api.minutes_reading, api.minutes_practice);
  return {
    id: api.slug, // use slug as stable id so progress keys match server slugs
    moduleId: moduleSlug,
    slug: api.slug,
    title: api.title,
    orderIndex: api.sort_order,
    estimatedMinutes: mins,
    level: api.level === 'intermediate' ? 'intermediate' : 'beginner',
    required: api.required,
    whyThisMatters: api.why_this_matters,
    objectives: api.objectives,
    prerequisites: api.prerequisites,
    sections: api.sections.map(adaptLessonSection),
    keyTerms: adaptKeyTerms(api.key_terms),
    summaryTakeaways: api.summary_takeaways,
    references: adaptReferences(api.references),
    publishedAt: api.published_at ?? '',
    version: api.version,
    locked: api.locked,
    accessTier: api.access_tier,
    hasLab: api.has_lab,
    hasQuiz: api.has_quiz,
  };
}

/** Map a locked lesson (metadata only) into a local Lesson stub. */
export function adaptLessonMeta(api: ApiLessonMeta, moduleSlug: string): Lesson {
  const mins = splitMinutes(api.estimated_minutes, api.minutes_reading, api.minutes_practice);
  return {
    id: api.slug,
    moduleId: moduleSlug,
    slug: api.slug,
    title: api.title,
    orderIndex: api.sort_order,
    estimatedMinutes: mins,
    level: api.level === 'intermediate' ? 'intermediate' : 'beginner',
    required: api.required,
    whyThisMatters: api.why_this_matters,
    objectives: api.objectives,
    prerequisites: [],
    sections: [],
    keyTerms: [],
    summaryTakeaways: [],
    references: [],
    publishedAt: '',
    version: api.version,
    locked: api.locked,
    accessTier: api.access_tier,
    hasLab: api.has_lab,
    hasQuiz: api.has_quiz,
  };
}

/** Map a module from the bundle into a local ModuleData (includes lessons). */
export function adaptModule(api: ApiModule, courseSlug: string): ModuleData {
  const lessons: Lesson[] = api.lessons.map(l =>
    'sections' in l ? adaptLessonFull(l as ApiLessonFull, api.slug) : adaptLessonMeta(l as ApiLessonMeta, api.slug)
  );
  return {
    id: api.slug,
    courseId: courseSlug,
    slug: api.slug,
    title: api.title,
    track: api.track,
    summary: api.summary,
    orderIndex: api.sort_order,
    required: api.required,
    objectives: api.objectives,
    lessons,
    moduleQuiz: api.quiz ? adaptQuiz(api.quiz) : undefined,
    onePageCheatSheet: api.one_page_cheat_sheet ?? '',
    locked: api.locked,
    accessTier: api.access_tier,
  };
}

function adaptQuiz(api: ApiQuiz): QuizData {
  return {
    id: api.scope_id, // canonical id = module slug; matches server progress key
    title: api.title,
    passingScore: api.passing_score,
    requiresSafetyPass: api.requires_safety_pass,
    questions: adaptQuizQuestions(api.questions),
    scope: 'module',
    scopeId: api.scope_id,
    locked: false, // quiz lock is derived from module access
  };
}

export function adaptCourseMetadata(api: ApiCourse): CourseMetadata {
  return {
    id: String(api.id),
    slug: api.slug,
    title: api.title,
    summary: api.summary,
    description: api.description,
    version: api.version,
    status: api.status as 'published' | 'draft',
    audience: api.audience,
    prerequisites: api.prerequisites,
    estimatedWeeks: api.estimated_weeks,
    estimatedHoursPerWeek: api.hours_per_week,
    totalEstimatedMinutes: api.total_estimated_minutes,
    outcomes: api.outcomes,
    author: api.author,
    safetyStatement: api.safety_statement,
    publishedAt: api.published_at ?? '',
    lastUpdated: api.last_updated ?? '',
  };
}

export function adaptResources(api: ApiResource[]): ResourceItem[] {
  return api.map(r => ({
    id: r.key,
    title: r.title,
    description: r.description,
    type: r.type as ResourceItem['type'],
    fileFormat: r.file_format,
    fileSize: '', // not in API
    version: r.version,
    lastUpdated: '', // not in API
    license: r.license,
    accessibilityNotes: '', // not in API
    downloadFileName: '', // not in API
    contentMarkdown: r.content_md,
    locked: r.locked,
    accessTier: r.access_tier,
  }));
}

export function adaptGlossary(api: ApiGlossaryItem[]): GlossaryItem[] {
  return api.map(g => ({
    id: g.key,
    term: g.term,
    acronym: g.acronym,
    definition: g.definition,
    track: g.track,
    relatedLessonSlugs: g.related_slugs,
  }));
}

export function adaptProgress(
  api: ApiProgress,
  slugToLessonId: Map<string, string>,
  moduleSlugToQuizId: Map<string, string>
): LearnerProgress {
  const completedLessonIds = api.completed_lessons
    .map(slug => slugToLessonId.get(slug) ?? slug); // fall back to slug (API content uses slug as id)

  const quizAttempts: LearnerProgress['quizAttempts'] = {};
  for (const [scopeId, q] of Object.entries(api.quizzes)) {
    const localQuizId = moduleSlugToQuizId.get(scopeId) ?? scopeId;
    quizAttempts[localQuizId] = {
      score: q.best_score,
      passed: q.passed,
      timestamp: q.last_attempt,
      attemptsCount: q.attempts,
    };
  }

  const labStates: LearnerProgress['labStates'] = {};
  for (const [labId, l] of Object.entries(api.labs)) {
    labStates[labId] = {
      completed: l.completed,
      lastSaved: l.updated_at,
      userDraft: l.draft,
    };
  }

  return {
    learnerId: 'server', // real learnerId from AuthContext
    completedLessonIds,
    quizAttempts,
    labStates,
    lastVisitedLessonSlug: '',
    enrolledAt: api.last_active_at,
    lastActiveAt: api.last_active_at,
    isServerSynced: true,
  };
}

export function adaptQuizSubmitResult(api: ApiQuizSubmitResult): {
  score: number;
  passed: boolean;
  safetyFailed: boolean;
  feedback: Record<string, { isCorrect: boolean; explanation: string }>;
} {
  const feedback: Record<string, { isCorrect: boolean; explanation: string }> = {};
  for (const r of api.results) {
    feedback[r.key] = { isCorrect: r.correct, explanation: r.explanation };
  }
  return { score: api.score, passed: api.passed, safetyFailed: api.safety_failed, feedback };
}