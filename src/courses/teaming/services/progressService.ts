import { LearnerProgress } from '../types/course.types';
import { ALL_MODULES, getAllLessons } from '../data/modulesManifest';
import { getModuleBySlug } from '../data/modulesManifest';

const STORAGE_KEY = 'portfolio_teaming_progress_v1';
const LEARNER_ID_KEY = 'portfolio_teaming_learner_id';

function generateLearnerId(): string {
  let id = localStorage.getItem(LEARNER_ID_KEY);
  if (!id) {
    id = 'learner_' + Math.random().toString(36).substring(2, 10) + '_' + Date.now().toString(36);
    localStorage.setItem(LEARNER_ID_KEY, id);
  }
  return id;
}

const DEFAULT_PROGRESS: LearnerProgress = {
  learnerId: '',
  completedLessonIds: [],
  quizAttempts: {},
  labStates: {},
  lastVisitedLessonSlug: null,
  enrolledAt: Date.now(),
  lastActiveAt: Date.now(),
  isServerSynced: false
};

export class ProgressService {
  private static instance: ProgressService;

  static getInstance(): ProgressService {
    if (!ProgressService.instance) {
      ProgressService.instance = new ProgressService();
    }
    return ProgressService.instance;
  }

  getProgress(): LearnerProgress {
    try {
      const raw = localStorage.getItem(STORAGE_KEY);
      if (!raw) {
        const initial = { ...DEFAULT_PROGRESS, learnerId: generateLearnerId() };
        this.saveProgress(initial);
        return initial;
      }
      const parsed = JSON.parse(raw) as LearnerProgress;
      if (!parsed.learnerId) {
        parsed.learnerId = generateLearnerId();
      }
      return parsed;
    } catch {
      return { ...DEFAULT_PROGRESS, learnerId: generateLearnerId() };
    }
  }

  saveProgress(progress: LearnerProgress): void {
    try {
      progress.lastActiveAt = Date.now();
      localStorage.setItem(STORAGE_KEY, JSON.stringify(progress));
    } catch (e) {
      console.warn('Failed to save learner progress to localStorage', e);
    }
  }

  isLessonCompleted(lessonId: string): boolean {
    const progress = this.getProgress();
    return progress.completedLessonIds.includes(lessonId);
  }

  markLessonComplete(lessonId: string, completed: boolean = true): LearnerProgress {
    const progress = this.getProgress();
    const set = new Set(progress.completedLessonIds);
    if (completed) {
      set.add(lessonId);
    } else {
      set.delete(lessonId);
    }
    progress.completedLessonIds = Array.from(set);
    this.saveProgress(progress);

    // Server write-through
    if (this.authConfig.enabled && this.authConfig.csrf) {
      // Find the lesson slug (for API content, lessonId === slug; for local, look it up)
      const lesson = getAllLessons().find(l => l.id === lessonId);
      const slug = lesson?.slug ?? lessonId;
      import('../../../platform/api/client').then(({ post }) => {
        post('progress-lesson.php', { lesson_slug: slug, completed }, this.authConfig.csrf).catch(() => {});
      });
    }

    return progress;
  }

  setLastVisitedLesson(slug: string): void {
    const progress = this.getProgress();
    progress.lastVisitedLessonSlug = slug;
    this.saveProgress(progress);
  }

  recordQuizAttempt(quizId: string, result: {
    score: number;
    passed: boolean;
    verificationToken?: string;
  }): LearnerProgress {
    const progress = this.getProgress();
    const existing = progress.quizAttempts[quizId] || { attemptsCount: 0, score: 0, passed: false, timestamp: 0 };
    progress.quizAttempts[quizId] = {
      score: Math.max(existing.score, result.score), // retain best score
      passed: existing.passed || result.passed,
      timestamp: Date.now(),
      attemptsCount: existing.attemptsCount + 1,
      verificationToken: result.verificationToken || existing.verificationToken
    };
    this.saveProgress(progress);
    return progress;
  }

  recordLabState(labId: string, completed: boolean, userDraft?: Record<string, unknown>): LearnerProgress {
    const progress = this.getProgress();
    progress.labStates[labId] = {
      completed,
      lastSaved: Date.now(),
      userDraft
    };
    this.saveProgress(progress);

    // Server write-through
    if (this.authConfig.enabled && this.authConfig.csrf) {
      import('../../../platform/api/client').then(({ post }) => {
        post('progress-lab.php', { lab_id: labId, completed, draft: userDraft }, this.authConfig.csrf).catch(() => {});
      });
    }

    return progress;
  }

  resetAllProgress(): LearnerProgress {
    const fresh: LearnerProgress = {
      learnerId: generateLearnerId(),
      completedLessonIds: [],
      quizAttempts: {},
      labStates: {},
      lastVisitedLessonSlug: null,
      enrolledAt: Date.now(),
      lastActiveAt: Date.now(),
      isServerSynced: false
    };
    this.saveProgress(fresh);
    return fresh;
  }

  /** Check if the learner passed the module quiz for a given module. */
  isModuleQuizPassed(moduleId: string): boolean {
    const mod = getModuleBySlug(moduleId);
    if (!mod?.moduleQuiz) return false;
    const progress = this.getProgress();
    const attempt = progress.quizAttempts[mod.moduleQuiz.id];
    return Boolean(attempt?.passed);
  }

  /** Configure server write-through (called once the API bundle is loaded). */
  private authConfig: { enabled: boolean; csrf: string | null; courseSlug: string } = {
    enabled: false,
    csrf: null,
    courseSlug: 'teaming',
  };

  configure(cfg: { enabled: boolean; csrf: string | null; courseSlug: string }): void {
    this.authConfig = cfg;
  }

  /** Replace local progress with server-authoritative data (used on bundle load). */
  hydrate(serverProgress: LearnerProgress): void {
    const local = this.getProgress();
    // Merge: server wins for keys it knows, keep local for anything else
    const merged: LearnerProgress = {
      ...local,
      ...serverProgress,
      // Ensure local learnerId persists if server didn't provide one
      learnerId: serverProgress.learnerId || local.learnerId,
      isServerSynced: true,
    };
    this.saveProgress(merged);
  }

  getCourseCompletionStats(): {
    totalRequired: number;
    completedRequired: number;
    percentage: number;
    isFullyComplete: boolean;
    totalLessons: number;
    completedLessons: number;
  } {
    const all = getAllLessons();
    const progress = this.getProgress();
    const requiredLessons = all.filter(l => l.required);
    const completedSet = new Set(progress.completedLessonIds);

    const completedRequired = requiredLessons.filter(l => completedSet.has(l.id)).length;
    const totalRequired = requiredLessons.length;
    const completedLessons = all.filter(l => completedSet.has(l.id)).length;

    const percentage = totalRequired > 0 ? Math.round((completedRequired / totalRequired) * 100) : 0;
    const isFullyComplete = totalRequired > 0 && completedRequired >= totalRequired;

    return {
      totalRequired,
      completedRequired,
      percentage,
      isFullyComplete,
      totalLessons: all.length,
      completedLessons
    };
  }

  getModuleCompletionStats(moduleId: string): {
    totalLessons: number;
    completedLessons: number;
    percentage: number;
    isModuleComplete: boolean;
  } {
    const mod = ALL_MODULES.find(m => m.id === moduleId);
    if (!mod) {
      return { totalLessons: 0, completedLessons: 0, percentage: 0, isModuleComplete: false };
    }
    const progress = this.getProgress();
    const completedSet = new Set(progress.completedLessonIds);
    const completed = mod.lessons.filter(l => completedSet.has(l.id)).length;
    const total = mod.lessons.length;
    const percentage = total > 0 ? Math.round((completed / total) * 100) : 0;

    return {
      totalLessons: total,
      completedLessons: completed,
      percentage,
      isModuleComplete: total > 0 && completed >= total
    };
  }
}

export const progressService = ProgressService.getInstance();
