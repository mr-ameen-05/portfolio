/**
 * Typed API helpers for the course content layer.
 */
import { get, post, ApiError } from '../api/client';
import type {
  ApiCourse,
  ApiLessonFull,
  ApiLessonMeta,
  ApiProgress,
  ApiQuizSubmitResult,
} from './types';

const COURSE_SLUG = 'teaming';

/**
 * Fetch the full course bundle (course + modules + lessons + resources + glossary).
 * Falls back gracefully when the API is unreachable (network error).
 */
export async function fetchBundle(
  signal?: AbortSignal
): Promise<{ course: ApiCourse; source: 'api' | 'local' }> {
  try {
    const data = await get<{ bundle: ApiCourse }>(
      `content-bundle.php?course=${COURSE_SLUG}`,
      signal
    );
    return { course: data.bundle, source: 'api' };
  } catch (e) {
    if (e instanceof ApiError && e.isNetwork) {
      // Network-level failure (API not deployed, offline, etc.)
      // The UI will fall back to the build-time JSON snapshot.
      throw e;
    }
    // Other errors (4xx/5xx) are still surfaced so the UI can show a message.
    throw e;
  }
}

/**
 * Fetch a single lesson (for deep-links when the bundle isn't loaded).
 * Used by LessonPlayerPage when navigating directly to a lesson slug.
 */
export async function fetchLesson(
  slug: string,
  signal?: AbortSignal
): Promise<{ lesson: ApiLessonFull; source: 'api' | 'local' }> {
  try {
    const data = await get<{ lesson: ApiLessonFull }>(
      `content-lesson.php?slug=${encodeURIComponent(slug)}`,
      signal
    );
    return { lesson: data.lesson, source: 'api' };
  } catch (e) {
    if (e instanceof ApiError && e.isNetwork) {
      throw e;
    }
    throw e;
  }
}

/**
 * Submit quiz answers for server-side grading.
 * For public-tier quizzes, works anonymously; for gated quizzes, requires auth.
 */
export async function submitQuiz(
  scope: 'module' | 'lesson',
  scopeId: string,
  answers: Record<string, number>,
  csrf: string | null
): Promise<ApiQuizSubmitResult> {
  return post<ApiQuizSubmitResult>(
    'content-quiz-submit.php',
    { scope, scope_id: scopeId, answers },
    csrf
  );
}

/**
 * Record lesson progress (mark complete / uncomplete).
 */
export async function recordLessonProgress(
  lessonSlug: string,
  completed: boolean,
  csrf: string | null
): Promise<{ success: boolean }> {
  return post('progress-lesson.php', { lesson_slug: lessonSlug, completed }, csrf);
}

/**
 * Record lab progress (completed + optional draft).
 */
export async function recordLabProgress(
  labId: string,
  completed: boolean,
  draft?: Record<string, unknown>,
  csrf?: string | null
): Promise<{ success: boolean }> {
  return post('progress-lab.php', { lab_id: labId, completed, draft }, csrf);
}

/**
 * Fetch the current learner's progress summary (server-side).
 */
export async function fetchProgress(
  signal?: AbortSignal
): Promise<{ progress: ApiProgress; source: 'api' | 'local' }> {
  try {
    const data = await get<{ progress: ApiProgress }>('progress.php', signal);
    return { progress: data.progress, source: 'api' };
  } catch (e) {
    if (e instanceof ApiError && e.isNetwork) {
      throw e;
    }
    throw e;
  }
}

/**
 * Enroll the current authenticated learner (grants `enrolled` tier).
 * Payments are deferred — this is the free-preview grant path.
 */
export async function enroll(csrf: string | null): Promise<{
  success: boolean;
  tier: 'enrolled';
  entitlements: { course: string; tier: string; access: string };
}> {
  return post('course-enroll.php', {}, csrf);
}