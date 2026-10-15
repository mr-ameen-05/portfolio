import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { Lock } from 'lucide-react';
import { getModuleBySlug, ALL_MODULES } from '../data/modulesManifest';
import { progressService } from '../services/progressService';
import { CourseNav } from '../components/layout/CourseNav';
import { CourseBreadcrumb } from '../components/layout/CourseBreadcrumb';
import { StateError, StateLoading } from '../components/common/CourseStates';
import { QuizWidget } from '../components/player/QuizWidget';
import { Track, AccessTier } from '../types/course.types';
import { CourseLockNotice } from '../components/layout/CourseLockNotice';

export const ModuleOverviewPage: React.FC = () => {
  const { moduleId } = useParams<{ moduleId: string }>();
  const [completedIds, setCompletedIds] = useState<Set<string>>(new Set());
  const [showCheatSheet, setShowCheatSheet] = useState(false);

  const module = moduleId ? getModuleBySlug(moduleId) : undefined;

  useEffect(() => {
    if (!module) return;
    const completed = new Set<string>();
    module.lessons.forEach(l => {
      if (progressService.isLessonCompleted(l.id)) {
        completed.add(l.id);
      }
    });
    setCompletedIds(completed);
  }, [moduleId, module]);

  if (!moduleId) {
    return <StateLoading message="Locating module specifications..." />;
  }

  if (!module) {
    return (
      <div className="min-h-screen bg-bg-primary text-text-primary">
        <CourseNav />
        <main className="max-w-4xl mx-auto px-4 py-12">
          <CourseBreadcrumb
            items={[
              { label: 'Module Not Found' },
            ]}
          />
          <div className="mt-8">
            <StateError
              title="Module Not Found"
              message={`The requested module "${moduleId}" does not exist in the course registry.`}
              onRetry={() => window.location.assign('/courses/teaming')}
            />
          </div>
        </main>
      </div>
    );
  }

  // Show lock notice if module is gated
  if (module.locked === true) {
    const tierLabel = module.accessTier === 'enrolled' ? 'Full Enrollment' : 'Free Account';
    return (
      <div className="min-h-screen bg-bg-primary text-text-primary">
        <CourseNav />
        <main className="max-w-4xl mx-auto px-4 py-12">
          <CourseBreadcrumb
            items={[
              { label: `Module ${module.orderIndex}: ${module.title}` },
            ]}
          />
          <CourseLockNotice
            requiredTier={(module.accessTier === 'public' ? 'registered' : module.accessTier) ?? 'enrolled'}
            title={`${tierLabel} Required: Module ${module.orderIndex}`}
            message={module.summary}
            fallbackLink={{ label: 'View course syllabus', href: '/courses/teaming' }}
          />
        </main>
      </div>
    );
  }

  const trackColors: Record<Track, { badge: string; border: string }> = {
    core: { badge: 'bg-emerald-500/10 text-emerald-400 border-emerald-500/30', border: 'border-emerald-500' },
    red: { badge: 'bg-rose-500/10 text-rose-400 border-rose-500/30', border: 'border-rose-500' },
    blue: { badge: 'bg-blue-500/10 text-blue-400 border-blue-500/30', border: 'border-blue-500' },
    purple: { badge: 'bg-purple-500/10 text-purple-400 border-purple-500/30', border: 'border-purple-500' },
  };

  const trackStyle = trackColors[module.track] || trackColors.core;
  const currentIdx = ALL_MODULES.findIndex(m => m.id === module.id);
  const prevModule = currentIdx > 0 ? ALL_MODULES[currentIdx - 1] : null;
  const nextModule = currentIdx < ALL_MODULES.length - 1 ? ALL_MODULES[currentIdx + 1] : null;

  const totalLessons = module.lessons.length;
  const completedCount = completedIds.size;
  const progressPercent = totalLessons > 0 ? Math.round((completedCount / totalLessons) * 100) : 0;

  return (
    <div className="min-h-screen bg-bg-primary text-text-primary">
      <CourseNav />

      <main className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-10">
        <CourseBreadcrumb
          items={[
            { label: `Module ${module.orderIndex}: ${module.title}` },
          ]}
        />

        {/* Module Header Card */}
        <section className="rounded-2xl border border-border-subtle bg-bg-secondary/40 p-6 md:p-8 space-y-6">
          <div className="flex flex-wrap items-center justify-between gap-4">
            <div className="flex items-center gap-2">
              <span className="text-sm font-mono font-bold text-accent">
                MODULE {module.orderIndex}
              </span>
              <span className={`text-xs font-mono px-2 py-0.5 rounded border uppercase font-semibold ${trackStyle.badge}`}>
                {module.track} track
              </span>
            </div>

            <div className="flex items-center gap-3 text-xs font-mono">
              <span className={progressPercent === 100 ? 'text-emerald-400 font-bold' : 'text-text-muted'}>
                {completedCount}/{totalLessons} Lessons ({progressPercent}%)
              </span>
            </div>
          </div>

          <div>
            <h1 className="text-2xl sm:text-3xl lg:text-4xl font-extrabold font-sans text-text-primary">
              {module.title}
            </h1>
            <p className="mt-3 text-sm sm:text-base text-text-secondary leading-relaxed">
              {module.summary}
            </p>
          </div>

          {/* Action Row */}
          <div className="flex flex-wrap items-center gap-3 pt-2">
            {module.lessons.length > 0 && (
              <Link
                to={`/courses/teaming/lessons/${module.lessons[0].slug}`}
                className="px-5 py-2.5 rounded-lg font-mono text-xs font-bold uppercase tracking-wider bg-accent text-black hover:bg-accent/90 transition-all shadow-md shadow-accent/10"
              >
                ▶ Start Lesson 1
              </Link>
            )}
            <button
              onClick={() => setShowCheatSheet(!showCheatSheet)}
              className="px-4 py-2.5 rounded-lg font-mono text-xs border border-border-subtle hover:border-accent text-text-secondary hover:text-text-primary bg-bg-primary transition-colors"
            >
              📑 {showCheatSheet ? 'Hide Cheat Sheet' : 'Quick Cheat Sheet'}
            </button>
          </div>

          {/* Collapsible Cheat Sheet */}
          {showCheatSheet && (
            <div className="mt-4 p-4 rounded-lg border border-accent/30 bg-bg-primary/80 space-y-2">
              <div className="text-xs font-mono text-accent font-bold uppercase">
                Module {module.orderIndex} Reference Cheat Sheet
              </div>
              <pre className="text-xs font-mono text-text-secondary whitespace-pre-line leading-relaxed overflow-x-auto">
                {module.onePageCheatSheet}
              </pre>
            </div>
          )}
        </section>

        {/* Learning Objectives */}
        <section className="space-y-4">
          <h2 className="text-xl font-bold font-sans text-text-primary flex items-center gap-2">
            <span>🎯</span> Module Objectives
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
            {module.objectives.map((obj: string, idx: number) => (
              <div
                key={idx}
                className="p-3.5 rounded-lg border border-border-subtle bg-bg-secondary/20 flex items-start gap-3"
              >
                <span className="text-xs font-mono px-2 py-0.5 rounded bg-accent/10 text-accent font-bold mt-0.5">
                  0{idx + 1}
                </span>
                <p className="text-xs sm:text-sm text-text-secondary leading-relaxed">
                  {obj}
                </p>
              </div>
            ))}
          </div>
        </section>

        {/* Lessons in this Module */}
        <section className="space-y-4">
          <div className="flex items-center justify-between">
            <h2 className="text-xl font-bold font-sans text-text-primary flex items-center gap-2">
              <span>📚</span> Lessons ({module.lessons.length})
            </h2>
            <span className="text-xs font-mono text-text-muted">
              Select any lesson to launch player
            </span>
          </div>

          <div className="space-y-3">
            {module.lessons.map((lesson, lIdx: number) => {
              const isDone = completedIds.has(lesson.id);
              const hasLab = lesson.sections.some(s => s.type === 'lab');
              const hasQuiz = lesson.sections.some(s => s.type === 'quiz');
              const lessonLocked = lesson.locked === true;

              return (
                <Link
                  key={lesson.slug}
                  to={`/courses/teaming/lessons/${lesson.slug}`}
                  className={`block p-4 rounded-xl border border-border-subtle bg-bg-secondary/30 hover:border-accent hover:bg-bg-secondary/60 transition-all group ${
                    lessonLocked ? 'opacity-60 cursor-not-allowed' : ''
                  }`}
                  aria-disabled={lessonLocked}
                >
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                    <div className="flex items-start gap-3">
                      <span
                        className={`w-6 h-6 rounded flex items-center justify-center font-mono text-xs flex-shrink-0 mt-0.5 ${
                          isDone
                            ? 'bg-emerald-500/20 text-emerald-400 border border-emerald-500'
                            : lessonLocked
                            ? 'bg-amber-500/10 text-amber-500 border border-amber-500/30'
                            : 'bg-bg-primary text-text-muted border border-border-subtle group-hover:border-accent'
                        }`}
                      >
                        {isDone ? '✓' : lessonLocked ? '🔒' : lIdx + 1}
                      </span>
                      <div className="min-w-0">
                        <div className="flex items-center gap-2">
                          <h3 className="text-sm sm:text-base font-bold text-text-primary group-hover:text-accent transition-colors truncate">
                            {lesson.title}
                          </h3>
                          {lessonLocked && (
                            <Lock className="w-3 h-3 text-amber-500 flex-shrink-0" aria-hidden="true" />
                          )}
                        </div>
                        <p className="mt-1 text-xs text-text-secondary line-clamp-2">
                          {lesson.whyThisMatters}
                        </p>
                      </div>
                    </div>

                    <div className="flex items-center gap-2 text-xs font-mono flex-shrink-0 sm:pl-4">
                      {hasLab && (
                        <span className="px-2 py-0.5 rounded bg-cyan-500/10 text-cyan-400 border border-cyan-500/30 text-[10px] font-bold">
                          LAB
                        </span>
                      )}
                      {hasQuiz && (
                        <span className="px-2 py-0.5 rounded bg-amber-500/10 text-amber-400 border border-amber-500/30 text-[10px] font-bold">
                          QUIZ
                        </span>
                      )}
                      <span className="text-text-muted">⏱ {lesson.estimatedMinutes.total}m</span>
                      <span className="text-accent group-hover:translate-x-1 transition-transform">
                        →
                      </span>
                    </div>
                  </div>
                </Link>
              );
            })}
          </div>
        </section>

        {/* Optional Module-Level Quiz */}
        {module.moduleQuiz && (
          <section className="space-y-4 pt-4 border-t border-border-subtle">
            <div className="space-y-1">
              <h2 className="text-xl font-bold font-sans text-text-primary flex items-center gap-2">
                <span>📝</span> Module {module.orderIndex} Knowledge Check
              </h2>
              <p className="text-xs text-text-secondary">
                Verify your understanding of this module's core principles before proceeding.
              </p>
            </div>
            <QuizWidget quiz={module.moduleQuiz} />
          </section>
        )}

        {/* Previous / Next Module Navigation */}
        <footer className="border-t border-border-subtle pt-6 flex flex-col sm:flex-row items-center justify-between gap-4">
          {prevModule ? (
            <Link
              to={`/courses/teaming/modules/${prevModule.slug}`}
              className="w-full sm:w-auto flex items-center gap-2 px-4 py-2.5 rounded border border-border-subtle bg-bg-secondary hover:border-accent hover:text-accent transition-colors text-xs font-mono group"
            >
              <span>←</span>
              <div>
                <div className="text-[10px] text-text-muted uppercase">Previous Module</div>
                <div className="font-semibold text-text-primary group-hover:text-accent">
                  Module {prevModule.orderIndex}: {prevModule.title}
                </div>
              </div>
            </Link>
          ) : (
            <div className="hidden sm:block" />
          )}

          {nextModule && (
            <Link
              to={`/courses/teaming/modules/${nextModule.slug}`}
              className="w-full sm:w-auto flex items-center justify-end gap-2 px-4 py-2.5 rounded border border-border-subtle bg-bg-secondary hover:border-accent hover:text-accent transition-colors text-xs font-mono group text-right"
            >
              <div>
                <div className="text-[10px] text-text-muted uppercase">Next Module</div>
                <div className="font-semibold text-text-primary group-hover:text-accent">
                  Module {nextModule.orderIndex}: {nextModule.title}
                </div>
              </div>
              <span>→</span>
            </Link>
          )}
        </footer>
      </main>
    </div>
  );
};
