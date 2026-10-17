import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { Lock } from 'lucide-react';
import { getLessonBySlug } from '../data/modulesManifest';
import { progressService } from '../services/progressService';
import { CourseNav } from '../components/layout/CourseNav';
import { CourseBreadcrumb } from '../components/layout/CourseBreadcrumb';
import { LessonSidebar } from '../components/player/LessonSidebar';
import { LessonContent } from '../components/player/LessonContent';
import { StateError, StateLocked, StateLoading } from '../components/common/CourseStates';
import { CourseLockNotice } from '../components/layout/CourseLockNotice';
import { AccessTier } from '../types/course.types';

export const LessonPlayerPage: React.FC = () => {
  const { slug } = useParams<{ slug: string }>();
  const [mobileSidebarOpen, setMobileSidebarOpen] = useState(false);
  const [isCompleted, setIsCompleted] = useState(false);

  const lessonData = slug ? getLessonBySlug(slug) : undefined;
  const lesson = lessonData?.lesson;
  const currentModule = lessonData?.module;

  useEffect(() => {
    if (lesson && slug) {
      progressService.setLastVisitedLesson(slug);
      setIsCompleted(progressService.isLessonCompleted(lesson.id));
    }
    // Scroll to top of lesson content on route change
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }, [slug, lesson]);

  const handleToggleComplete = () => {
    if (!lesson) return;
    const nextState = !isCompleted;
    progressService.markLessonComplete(lesson.id, nextState);
    setIsCompleted(nextState);
  };

  if (!slug) {
    return <StateLoading message="Initializing course player..." />;
  }

  if (!lesson || !currentModule) {
    return (
      <div className="min-h-screen bg-bg-primary text-text-primary">
        <CourseNav />
        <main className="max-w-4xl mx-auto px-4 py-12">
          <CourseBreadcrumb
            items={[
              { label: 'Lesson Not Found' },
            ]}
          />
          <div className="mt-8">
            <StateError
              title="Lesson Not Found"
              message={`The requested lesson "${slug}" could not be located in any course module.`}
              onRetry={() => window.location.assign('/courses/teaming')}
            />
          </div>
        </main>
      </div>
    );
  }

  // Show lock notice if lesson is gated
  if (lesson.locked === true) {
    const tierLabel = lesson.accessTier === 'enrolled' ? 'Full Enrollment' : 'Free Account';
    return (
      <div className="min-h-screen bg-bg-primary text-text-primary">
        <CourseNav />
        <main className="max-w-4xl mx-auto px-4 py-12">
          <CourseBreadcrumb
            items={[
              { label: `M${currentModule.orderIndex}`, path: `/courses/teaming/modules/${currentModule.slug}` },
              { label: lesson.title },
            ]}
          />
          <CourseLockNotice
            requiredTier={(lesson.accessTier === 'public' ? 'registered' : lesson.accessTier) ?? 'enrolled'}
            title={`${tierLabel} Required: ${lesson.title}`}
            message={lesson.whyThisMatters}
            fallbackLink={{ label: 'View module overview', href: `/courses/teaming/modules/${currentModule.slug}` }}
          />
        </main>
      </div>
    );
  }

  // Safety gate check: If this is an offensive module (e.g. Module 4 or 5) and learner has not completed Module 0 safety check
  const isOffensiveTrack = currentModule.track === 'red';
  const isSafetyLocked = isOffensiveTrack && !progressService.isModuleQuizPassed(currentModule.id);

  return (
    <div className="min-h-screen bg-bg-primary text-text-primary">
      <CourseNav />

      {/* Main container with 2 columns */}
      <div className="max-w-[1600px] mx-auto flex">
        {/* Left Lesson Navigation Sidebar */}
        <LessonSidebar
          currentLessonSlug={slug}
          mobileOpen={mobileSidebarOpen}
          onMobileClose={() => setMobileSidebarOpen(false)}
        />

        {/* Right Player Main Area */}
        <main className="flex-1 min-w-0 px-4 sm:px-6 lg:px-10 py-6 space-y-8">
          {/* Mobile Curriculum Toggle & Breadcrumb */}
          <div className="flex items-center justify-between gap-4 border-b border-border-subtle/50 pb-3">
            <CourseBreadcrumb
              items={[
                {
                  label: `M${currentModule.orderIndex}`,
                  path: `/courses/teaming/modules/${currentModule.slug}`,
                },
                { label: lesson.title },
              ]}
            />

            <button
              onClick={() => setMobileSidebarOpen(true)}
              className="lg:hidden flex items-center gap-1.5 px-3 py-1.5 rounded bg-bg-secondary border border-border-subtle text-xs font-mono text-accent hover:border-accent"
              aria-label="Open curriculum syllabus drawer"
            >
              <span>☰</span>
              <span>Curriculum</span>
            </button>
          </div>

          {/* Module 0 Safety Warning Lock for offensive lessons */}
          {isSafetyLocked ? (
            <div className="mb-6">
              <StateLocked
                lessonTitle={lesson.title}
                prerequisiteNames={[
                  'Module 0: Orientation, Ethics, and Safe Practice',
                  'Module 0 Quiz: Safety and ROE Compliance (100% required on safety items)'
                ]}
              />
            </div>
          ) : (
            <>
              {/* Lesson Main Content with embedded labs and quizzes */}
              <LessonContent
                lesson={lesson}
                isCompleted={isCompleted}
                onToggleComplete={handleToggleComplete}
              />

              {/* Completion Status Card */}
              <div className="max-w-4xl mx-auto p-5 sm:p-6 rounded-2xl glass-panel-glow border border-white/10 flex flex-col sm:flex-row items-center justify-between gap-4 shadow-xl">
                <div className="flex items-center gap-3">
                  <div
                    className={`w-11 h-11 rounded-xl flex items-center justify-center font-bold text-sm ${
                      isCompleted
                        ? 'bg-emerald-500/20 text-emerald-400 border border-emerald-500'
                        : 'glass-pill text-text-muted border border-white/10'
                    }`}
                  >
                    {isCompleted ? '✓' : '○'}
                  </div>
                  <div>
                    <div className="text-xs font-mono font-bold text-text-primary">
                      {isCompleted ? 'Lesson Completed' : 'Lesson In Progress'}
                    </div>
                    <div className="text-xs text-text-muted">
                      {isCompleted
                        ? 'Great work! Your progress has been saved to your local profile.'
                        : 'Work through the sections, run any lab exercises, and mark as complete when done.'}
                    </div>
                  </div>
                </div>

                <button
                  onClick={handleToggleComplete}
                  className={`px-5 py-2.5 rounded-xl text-xs font-mono uppercase tracking-wider transition-all border ${
                    isCompleted
                      ? 'glass-pill text-text-muted hover:text-rose-400 hover:border-rose-500/40'
                      : 'bg-accent text-black font-bold hover:bg-accent/90 border-accent shadow-md shadow-accent/20 hover:scale-105'
                  }`}
                >
                  {isCompleted ? 'Mark as Incomplete' : 'Mark as Complete ✓'}
                </button>
              </div>
            </>
          )}
        </main>
      </div>
    </div>
  );
};
