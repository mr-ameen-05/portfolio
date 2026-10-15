import React, { createContext, useCallback, useContext, useEffect, useMemo, useState } from 'react';
import { Outlet, useLocation, Navigate } from 'react-router-dom';
import { fetchBundle, fetchProgress, enroll as apiEnroll } from './api';
import { adaptCourseMetadata, adaptModule, adaptResources, adaptGlossary, adaptProgress } from './adapt';
import { setCourseModules } from '../../courses/teaming/data/modulesManifest';
import { setCourseMetadata } from '../../courses/teaming/data/courseMetadata';
import { setCourseResources } from '../../courses/teaming/data/resourcesData';
import { setGlossaryItems } from '../../courses/teaming/data/glossaryData';
import { progressService } from '../../courses/teaming/services/progressService';
import { quizService } from '../../courses/teaming/services/quizService';
import { useAuth } from '../auth/AuthContext';

export type CourseContentStatus = 'loading' | 'ready' | 'error';
export type CourseAccess = 'guest' | 'registered' | 'enrolled';

interface CourseContentContextValue {
  status: CourseContentStatus;
  access: CourseAccess;
  error?: string;
  /** True when the build-time JSON snapshot is active (API not deployed/offline). */
  usingLocalContent: boolean;
  /** Force a fresh fetch (e.g. after login/enrollment). */
  reload: () => void;
  /** Enroll the current authenticated learner (grants `enrolled` tier). */
  enroll: () => Promise<void>;
}

const CourseContentContext = createContext<CourseContentContextValue | undefined>(undefined);

export function useCourseContent(): CourseContentContextValue {
  const ctx = useContext(CourseContentContext);
  if (!ctx) throw new Error('useCourseContent must be used within a CourseContentProvider');
  return ctx;
}

/**
 * Top-level course shell:
 *  - Loads the course bundle from the API (or falls back to local content)
 *  - Hydrates the live-binding content stores (modules, resources, glossary, metadata)
 *  - Hydrates server-side progress when authenticated
 *  - Configures progressService for server write-through
 *  - Renders children once ready
 */
export function CourseContentProvider({ children }: { children: React.ReactNode }) {
  const { user, csrf, entitlements, unavailable, status: authStatus } = useAuth();
  const [status, setStatus] = useState<CourseContentStatus>('loading');
  const [access, setAccess] = useState<CourseAccess>('guest');
  const [error, setError] = useState<string | undefined>();
  const [usingLocalContent, setUsingLocalContent] = useState(false);
  const location = useLocation();

  const tier = entitlements?.tier ?? null;
  const accessLevel = entitlements?.access ?? 'guest';

  const loadBundle = useCallback(async () => {
    if (authStatus !== 'ready') return;
    setStatus('loading');
    setError(undefined);

    try {
      const { course, source } = await fetchBundle();
      setUsingLocalContent(source === 'local');
      setAccess(course.access);

      // Hydrate live-binding content stores
      const modules = course.modules.map(m => adaptModule(m, course.slug));
      setCourseModules(modules);
      setCourseMetadata(adaptCourseMetadata(course));
      setCourseResources(adaptResources(course.resources));
      setGlossaryItems(adaptGlossary(course.glossary));

      // Build lookup maps for progress hydration
      const slugToLessonId = new Map<string, string>();
      for (const mod of modules) {
        for (const l of mod.lessons) slugToLessonId.set(l.slug, l.id);
      }
      const moduleSlugToQuizId = new Map<string, string>();
      for (const mod of modules) {
        if (mod.moduleQuiz) moduleSlugToQuizId.set(mod.moduleQuiz.scopeId!, mod.moduleQuiz.id);
      }

      // If authenticated, hydrate server progress and configure write-through
      if (user && csrf) {
        try {
          const { progress } = await fetchProgress();
          const adapted = adaptProgress(progress, slugToLessonId, moduleSlugToQuizId);
          // Use public hydrate method (server wins for known keys)
          progressService.hydrate(adapted);
          // Configure write-through for progress
          progressService.configure({ enabled: true, csrf, courseSlug: COURSE_SLUG });
          // Configure quizService for server grading
          quizService.configure({ csrf });
        } catch (e) {
          if (!(e instanceof Error && e.name === 'ApiError' && (e as { isNetwork?: boolean }).isNetwork)) {
            console.warn('Failed to hydrate server progress', e);
          }
        }
      }

      setStatus('ready');
    } catch (e) {
      if (e instanceof Error && e.name === 'ApiError' && (e as { isNetwork?: boolean }).isNetwork) {
        // API unreachable: keep local content, mark ready
        setUsingLocalContent(true);
        setStatus('ready');
      } else {
        setError(e instanceof Error ? e.message : 'Could not load the course');
        setStatus('error');
      }
    }
  }, [authStatus, user, csrf]);

  // Initial load + reload when auth/entitlements change
  useEffect(() => {
    if (authStatus === 'ready') loadBundle();
  }, [authStatus, user, tier, accessLevel, loadBundle]);

  const reload = useCallback(() => { loadBundle(); }, [loadBundle]);

  const enroll = useCallback(async () => {
    if (!user || !csrf) throw new Error('Not authenticated');
    await apiEnroll(csrf);
    // AuthContext will refresh entitlements; reload will fire via effect
  }, [user, csrf]);

  const value = useMemo<CourseContentContextValue>(
    () => ({ status, access, error, usingLocalContent, reload, enroll }),
    [status, access, error, usingLocalContent, reload, enroll]
  );

  // Define COURSE_SLUG here since it's used in the component
  const COURSE_SLUG = 'teaming';

  // While loading, show a lightweight spinner at the page level
  if (status === 'loading') {
    return (
      <div className="min-h-screen flex items-center justify-center bg-bg-primary">
        <div className="flex flex-col items-center gap-4">
          <div className="w-10 h-10 border-2 border-cyan-500/20 border-t-cyan-400 rounded-full animate-spin" />
          <p className="font-mono text-sm text-text-muted">Loading course...</p>
        </div>
      </div>
    );
  }

  // If the API returned an error but local content is usable, still render
  if (status === 'error' && usingLocalContent) {
    return <>{children}</>;
  }

  // Hard error (API failed and no local fallback)
  if (status === 'error') {
    return (
      <div className="min-h-screen flex items-center justify-center bg-bg-primary px-6">
        <div className="text-center max-w-md">
          <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-rose-500/10 flex items-center justify-center">
            <svg className="w-8 h-8 text-rose-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
            </svg>
          </div>
          <h2 className="text-xl font-semibold text-text-primary mb-2">Couldn't load the course</h2>
          <p className="text-text-muted mb-6">{error}</p>
          <button
            onClick={reload}
            className="px-4 py-2 bg-cyan-500/20 border border-cyan-500/30 text-cyan-400 rounded-lg hover:bg-cyan-500/30 transition"
          >
            Try again
          </button>
        </div>
      </div>
    );
  }

  return (
    <CourseContentContext.Provider value={value}>
      {children}
    </CourseContentContext.Provider>
  );
}