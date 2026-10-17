import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Lock } from 'lucide-react';
import { COURSE_METADATA } from '../data/courseMetadata';
import { ALL_MODULES } from '../data/modulesManifest';
import { progressService } from '../services/progressService';
import { CourseNav } from '../components/layout/CourseNav';
import { CourseBreadcrumb } from '../components/layout/CourseBreadcrumb';
import { Track, AccessTier } from '../types/course.types';

export const TeamingLandingPage: React.FC = () => {
  const [stats, setStats] = useState(() => progressService.getCourseCompletionStats());
  const [lastVisitedSlug, setLastVisitedSlug] = useState<string | null>(null);

  useEffect(() => {
    setStats(progressService.getCourseCompletionStats());
    setLastVisitedSlug(progressService.getProgress().lastVisitedLessonSlug);
  }, []);

  const totalLessons = ALL_MODULES.reduce((acc, m) => acc + m.lessons.length, 0);
  const totalLabs = ALL_MODULES.filter(m => m.lessons.some(l => l.sections.some(s => s.type === 'lab'))).length;

  const trackBadges: Record<Track, { label: string; color: string; desc: string }> = {
    core: {
      label: 'Core Track',
      color: 'bg-emerald-500/10 text-emerald-400 border-emerald-500/30',
      desc: 'Foundational ethics, systems & networking, risk calculations, and defensive architecture.',
    },
    red: {
      label: 'Red Team Track',
      color: 'bg-rose-500/10 text-rose-400 border-rose-500/30',
      desc: 'Structured scoping, passive reconnaissance, contained testing, and actionable reporting.',
    },
    blue: {
      label: 'Blue Team Track',
      color: 'bg-blue-500/10 text-blue-400 border-blue-500/30',
      desc: 'Log normalization, process parentage analysis, incident response, and containment.',
    },
    purple: {
      label: 'Purple Team Track',
      color: 'bg-purple-500/10 text-purple-400 border-purple-500/30',
      desc: 'Continuous feedback loops, threat modeling alignment, and multi-tier enterprise capstone.',
    },
  };

  const resumeTarget = lastVisitedSlug
    ? `/courses/teaming/lessons/${lastVisitedSlug}`
    : `/courses/teaming/lessons/${ALL_MODULES[0]?.lessons[0]?.slug || 'how-to-use-this-course'}`;

  const tierOrder: Record<AccessTier, number> = { public: 0, registered: 1, enrolled: 2 };
  const getTierRank = (tier?: AccessTier) => tier ? tierOrder[tier] : 0;

  return (
    <div className="min-h-screen bg-bg-primary text-text-primary">
      <CourseNav />

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-16">
        <CourseBreadcrumb items={[]} />

        {/* Hero Section */}
        <section className="relative rounded-3xl glass-panel p-6 sm:p-10 md:p-14 overflow-hidden border border-white/10 shadow-2xl">
          {/* Ambient glassmorphic backlight glow */}
          <div className="absolute -top-32 -right-32 w-[30rem] h-[30rem] bg-cyan-500/15 rounded-full blur-3xl pointer-events-none" />
          <div className="absolute -bottom-32 -left-32 w-80 h-80 bg-accent/10 rounded-full blur-3xl pointer-events-none" />

          <div className="relative z-10 max-w-3xl space-y-6">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full glass-pill text-xs font-mono text-accent">
              <span>🛡️ Version {COURSE_METADATA.version}</span>
              <span className="text-white/20">•</span>
              <span>Production-Grade Curriculum</span>
            </div>

            <h1 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold font-sans tracking-tight text-text-primary leading-tight drop-shadow-sm">
              {COURSE_METADATA.title}
            </h1>

            <p className="text-base sm:text-lg text-text-secondary leading-relaxed">
              {COURSE_METADATA.description}
            </p>

            {/* Quick stats strip */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 pt-2 text-xs font-mono">
              <div className="p-3 rounded-xl glass-panel-subtle hover:border-accent/40 transition-colors">
                <div className="text-text-muted">Modules</div>
                <div className="text-xl font-bold text-accent">{ALL_MODULES.length}</div>
              </div>
              <div className="p-3 rounded-xl glass-panel-subtle hover:border-accent/40 transition-colors">
                <div className="text-text-muted">Lessons</div>
                <div className="text-xl font-bold text-accent">{totalLessons}</div>
              </div>
              <div className="p-3 rounded-xl glass-panel-subtle hover:border-accent/40 transition-colors">
                <div className="text-text-muted">Synthetic Labs</div>
                <div className="text-xl font-bold text-accent">{totalLabs}</div>
              </div>
              <div className="p-3 rounded-xl glass-panel-subtle hover:border-accent/40 transition-colors">
                <div className="text-text-muted">Pacing</div>
                <div className="text-xl font-bold text-accent">{COURSE_METADATA.estimatedWeeks}</div>
              </div>
            </div>

            {/* CTA Buttons */}
            <div className="flex flex-wrap items-center gap-4 pt-4">
              <Link
                to={resumeTarget}
                className="px-6 py-3 rounded-xl font-mono text-xs font-bold uppercase tracking-wider bg-accent text-black hover:bg-accent/90 transition-all shadow-lg shadow-accent/20 hover:scale-[1.02] active:scale-[0.98]"
              >
                {stats.completedLessons > 0 ? '▶ Resume Course' : '▶ Start Module 0'}
              </Link>
              <Link
                to="/courses/teaming/progress"
                className="px-5 py-3 rounded-xl font-mono text-xs font-bold uppercase tracking-wider glass-pill hover:border-accent text-text-secondary hover:text-text-primary transition-all hover:scale-[1.02]"
              >
                📊 View Progress ({stats.percentage}%)
              </Link>
              <Link
                to="/courses/teaming/resources"
                className="px-5 py-3 rounded-xl font-mono text-xs font-bold uppercase tracking-wider glass-pill hover:border-accent text-text-secondary hover:text-text-primary transition-all hover:scale-[1.02]"
              >
                📁 Download Templates
              </Link>
            </div>
          </div>
        </section>

        {/* Safety & Ethics Banner (Mandatory Notice) */}
        <section className="rounded-2xl border border-rose-500/25 bg-rose-950/20 backdrop-blur-xl p-6 space-y-3 shadow-lg">
          <div className="flex items-center gap-2 text-rose-400 font-mono text-sm font-bold uppercase tracking-wider">
            <span>⚠️ Safety, Authorization, and Responsible Disclosure Notice</span>
          </div>
          <p className="text-xs sm:text-sm text-text-secondary leading-relaxed">
            {COURSE_METADATA.safetyStatement}
          </p>
          <div className="text-xs font-mono text-text-muted">
            All labs run on client-side synthetic simulators or isolated fixtures. Never scan or execute tests against systems without prior written authorization from the system owner.
          </div>
        </section>

        {/* 4 Tracks Breakdown */}
        <section className="space-y-6">
          <div className="space-y-1">
            <h2 className="text-2xl font-bold font-sans text-text-primary">
              Four Interlocking Tracks
            </h2>
            <p className="text-sm text-text-secondary">
              A balanced approach integrating offense, defense, and cross-functional continuous collaboration.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            {(Object.keys(trackBadges) as Track[]).map(t => {
              const trackInfo = trackBadges[t];
              const moduleCount = ALL_MODULES.filter(m => m.track === t).length;
              return (
                <div
                  key={t}
                  className="rounded-2xl glass-panel-subtle p-5 space-y-3 hover:border-accent/40 transition-all duration-300 hover:-translate-y-0.5"
                >
                  <span className={`inline-block px-2.5 py-0.5 rounded border text-xs font-mono font-bold uppercase ${trackInfo.color}`}>
                    {trackInfo.label}
                  </span>
                  <p className="text-xs text-text-secondary leading-relaxed">
                    {trackInfo.desc}
                  </p>
                  <div className="text-xs font-mono text-text-muted pt-2 border-t border-border-subtle/50">
                    {moduleCount} Modules in this track
                  </div>
                </div>
              );
            })}
          </div>
        </section>

        {/* Learning Outcomes */}
        <section className="space-y-6">
          <div className="space-y-1">
            <h2 className="text-2xl font-bold font-sans text-text-primary">
              What You Will Build & Master
            </h2>
            <p className="text-sm text-text-secondary">
              Measurable competencies aligned with real-world security operations.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {COURSE_METADATA.outcomes.map((outcome: string, idx: number) => (
              <div
                key={idx}
                className="p-4 rounded-xl glass-panel-subtle flex gap-3 items-start hover:border-accent/40 transition-all duration-200"
              >
                <span className="text-xs font-mono px-2 py-0.5 rounded bg-accent/10 text-accent font-bold">
                  0{idx + 1}
                </span>
                <p className="text-xs sm:text-sm text-text-secondary leading-relaxed">
                  {outcome}
                </p>
              </div>
            ))}
          </div>
        </section>

        {/* 11-Module Syllabus */}
        <section className="space-y-6">
          <div className="flex flex-wrap items-center justify-between gap-4">
            <div>
              <h2 className="text-2xl font-bold font-sans text-text-primary">
                Comprehensive 11-Module Syllabus
              </h2>
              <p className="text-sm text-text-secondary">
                From ethical orientation to the enterprise-grade Meridian Health capstone.
              </p>
            </div>
            <Link
              to="/courses/teaming/glossary"
              className="text-xs font-mono text-accent hover:underline"
            >
              View 40+ Course Terms Glossary →
            </Link>
          </div>

          <div className="space-y-4">
            {ALL_MODULES.map(module => {
              const trackInfo = trackBadges[module.track];
              const completedCount = module.lessons.filter(l =>
                progressService.isLessonCompleted(l.id)
              ).length;
              const isModuleComplete = completedCount === module.lessons.length;
              const isLocked = module.locked === true;
              const moduleTier = module.accessTier as AccessTier | undefined;

              return (
                <div
                  key={module.id}
                  className={`rounded-2xl glass-panel p-5 sm:p-6 hover:border-cyan-400/40 transition-all duration-300 space-y-4 ${
                    isLocked ? 'opacity-75 border-amber-500/30' : ''
                  }`}
                >
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-white/5 pb-3">
                    <div className="flex items-center gap-3">
                      <span className="text-sm font-mono font-bold text-accent">
                        Module {module.orderIndex}
                      </span>
                      <span className={`text-[10px] font-mono px-2 py-0.5 rounded border uppercase font-bold ${trackInfo.color}`}>
                        {module.track}
                      </span>
                      {isLocked && (
                        <span className="flex items-center gap-1 px-2 py-0.5 rounded bg-amber-500/10 border border-amber-500/30 text-amber-400 text-[10px] font-mono">
                          <Lock className="w-3 h-3" aria-hidden="true" />
                          {moduleTier ? moduleTier.charAt(0).toUpperCase() + moduleTier.slice(1) : 'Locked'}
                        </span>
                      )}
                      <h3 className="text-base font-bold text-text-primary font-sans">
                        {module.title}
                      </h3>
                    </div>

                    <div className="flex items-center gap-3 text-xs font-mono">
                      <span className={isModuleComplete ? 'text-emerald-400 font-bold' : 'text-text-muted'}>
                        {completedCount}/{module.lessons.length} Completed
                      </span>
                      <Link
                        to={`/courses/teaming/modules/${module.slug}`}
                        className="px-3 py-1 rounded-lg glass-pill text-accent hover:border-accent text-xs font-mono transition-colors"
                      >
                        Overview →
                      </Link>
                    </div>
                  </div>

                  <p className="text-xs text-text-secondary leading-relaxed">
                    {module.summary}
                  </p>

                  {/* Lessons list preview */}
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 pt-1">
                    {module.lessons.map(lesson => {
                      const isCompleted = progressService.isLessonCompleted(lesson.id);
                      const hasLab = lesson.sections.some(s => s.type === 'lab');
                      const hasQuiz = lesson.sections.some(s => s.type === 'quiz');
                      const lessonLocked = lesson.locked === true;

                      return (
                        <Link
                          key={lesson.slug}
                          to={`/courses/teaming/lessons/${lesson.slug}`}
                          className={`flex items-center justify-between p-2.5 rounded-xl glass-panel-subtle hover:bg-white/10 text-xs transition-colors group ${
                            lessonLocked ? 'opacity-60 cursor-not-allowed' : ''
                          }`}
                          aria-disabled={lessonLocked}
                        >
                          <div className="flex items-center gap-2 min-w-0">
                            {lessonLocked && (
                              <Lock className="w-3 h-3 text-amber-500 flex-shrink-0" aria-hidden="true" />
                            )}
                            <span className={isCompleted ? 'text-emerald-400 font-bold' : 'text-text-muted'}>
                              {isCompleted ? '✓' : lessonLocked ? '🔒' : '○'}
                            </span>
                            <span className="text-text-secondary group-hover:text-text-primary truncate">
                              {lesson.title}
                            </span>
                          </div>
                          <div className="flex items-center gap-1.5 text-[10px] font-mono text-text-muted flex-shrink-0">
                            {hasLab && <span className="text-cyan-400 font-semibold">LAB</span>}
                            {hasQuiz && <span className="text-amber-400 font-semibold">QUIZ</span>}
                            <span>{lesson.estimatedMinutes.total}m</span>
                          </div>
                        </Link>
                      );
                    })}
                  </div>
                </div>
              );
            })}
          </div>
        </section>

        {/* Prerequisites & Target Audience */}
        <section className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="rounded-2xl glass-panel p-6 space-y-3">
            <h3 className="text-base font-bold font-sans text-text-primary">
              Prerequisites & Background
            </h3>
            <ul className="space-y-2 text-xs text-text-secondary">
              {COURSE_METADATA.prerequisites.map((req: string, idx: number) => (
                <li key={idx} className="flex items-start gap-2">
                  <span className="text-accent font-bold">✓</span>
                  <span>{req}</span>
                </li>
              ))}
            </ul>
          </div>

          <div className="rounded-2xl glass-panel p-6 space-y-3">
            <h3 className="text-base font-bold font-sans text-text-primary">
              Target Audience
            </h3>
            <p className="text-xs text-text-secondary leading-relaxed">
              {COURSE_METADATA.audience}
            </p>
          </div>
        </section>

        {/* Capstone Callout */}
        <section className="rounded-3xl glass-panel-glow p-8 md:p-12 text-center space-y-5 border border-cyan-500/30">
          <div className="inline-block px-3 py-1 rounded-full glass-pill text-cyan-400 font-mono text-xs uppercase font-bold">
            Culminating Experience
          </div>
          <h2 className="text-2xl sm:text-3xl lg:text-4xl font-extrabold font-sans text-text-primary">
            Meridian Health Logistics Purple Team Capstone
          </h2>
          <p className="text-sm text-text-secondary max-w-2xl mx-auto leading-relaxed">
            Execute all 5 phases of a simulated joint security assessment: Scope validation, threat model review, finding identification, SOC telemetry correlation, and remediation engineering.
          </p>
          <div className="pt-2">
            <Link
              to="/courses/teaming/capstone"
              className="inline-block px-6 py-3 rounded-xl font-mono text-xs font-bold uppercase tracking-wider bg-accent text-black hover:bg-accent/90 transition-all shadow-lg shadow-accent/20 hover:scale-105"
            >
              Explore Capstone Scenario & Rubric →
            </Link>
          </div>
        </section>
      </main>
    </div>
  );
};
