import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { ALL_MODULES } from '../data/modulesManifest';
import { progressService } from '../services/progressService';
import { CourseNav } from '../components/layout/CourseNav';
import { CourseBreadcrumb } from '../components/layout/CourseBreadcrumb';
import { StorageBadge } from '../components/layout/StorageBadge';
import { COURSE_METADATA } from '../data/courseMetadata';

export const LearnerProgressPage: React.FC = () => {
  const [stats, setStats] = useState(() => progressService.getCourseCompletionStats());
  const [learnerName, setLearnerName] = useState('Security Practitioner');
  const [showCertificate, setShowCertificate] = useState(false);
  const [showResetModal, setShowResetModal] = useState(false);
  const [resetConfirmInput, setResetConfirmInput] = useState('');

  useEffect(() => {
    setStats(progressService.getCourseCompletionStats());
    const savedName = localStorage.getItem('course_learner_name');
    if (savedName) setLearnerName(savedName);
  }, []);

  const handleNameChange = (name: string) => {
    setLearnerName(name);
    localStorage.setItem('course_learner_name', name);
  };

  const handleReset = () => {
    if (resetConfirmInput.trim().toUpperCase() === 'RESET') {
      progressService.resetAllProgress();
      setStats(progressService.getCourseCompletionStats());
      setShowResetModal(false);
      setResetConfirmInput('');
    }
  };

  const isEligibleForCertificate = stats.isFullyComplete;

  return (
    <div className="min-h-screen bg-bg-primary text-text-primary">
      <CourseNav />

      <main className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-10">
        <CourseBreadcrumb
          items={[
            { label: 'Learner Dashboard & Progress' },
          ]}
        />

        {/* Dashboard Header */}
        <section className="rounded-2xl border border-border-subtle bg-bg-secondary/40 p-6 md:p-8 space-y-6">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div>
              <div className="flex items-center gap-2 mb-1">
                <span className="text-xs font-mono uppercase tracking-wider text-accent font-bold">
                  Learner Dashboard
                </span>
                <StorageBadge isServerSynced={false} />
              </div>
              <h1 className="text-2xl sm:text-3xl font-extrabold font-sans text-text-primary">
                Your Course Progress
              </h1>
            </div>

            <div className="flex items-center gap-3">
              <button
                onClick={() => setShowResetModal(true)}
                className="px-3.5 py-2 rounded-lg border border-rose-500/30 hover:border-rose-500 text-rose-400 hover:bg-rose-500/10 text-xs font-mono transition-colors"
              >
                🗑 Reset Progress
              </button>
            </div>
          </div>

          {/* Overall Progress Bar */}
          <div className="space-y-2">
            <div className="flex items-center justify-between text-xs font-mono">
              <span className="text-text-secondary">Overall Completion</span>
              <span className="text-accent font-bold text-sm">{stats.percentage}%</span>
            </div>
            <div className="h-3 w-full bg-bg-primary rounded-full overflow-hidden border border-border-subtle">
              <div
                className="h-full bg-gradient-to-r from-accent to-emerald-400 transition-all duration-500 rounded-full"
                style={{ width: `${stats.percentage}%` }}
              />
            </div>
          </div>

          {/* Quick Metrics Grid */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 pt-2 text-xs font-mono">
            <div className="p-4 rounded-xl border border-border-subtle bg-bg-primary">
              <div className="text-text-muted">Lessons Completed</div>
              <div className="text-2xl font-bold text-text-primary mt-1">
                {stats.completedLessons} <span className="text-text-muted text-sm font-normal">/ {stats.totalLessons}</span>
              </div>
            </div>

            <div className="p-4 rounded-xl border border-border-subtle bg-bg-primary">
              <div className="text-text-muted">Required Units</div>
              <div className="text-2xl font-bold text-emerald-400 mt-1">
                {stats.completedRequired} <span className="text-text-muted text-sm font-normal">/ {stats.totalRequired}</span>
              </div>
            </div>

            <div className="p-4 rounded-xl border border-border-subtle bg-bg-primary">
              <div className="text-text-muted">Course Modules</div>
              <div className="text-2xl font-bold text-accent mt-1">
                {ALL_MODULES.length} <span className="text-text-muted text-sm font-normal">Modules</span>
              </div>
            </div>

            <div className="p-4 rounded-xl border border-border-subtle bg-bg-primary">
              <div className="text-text-muted">Capstone Status</div>
              <div className="text-sm font-bold text-purple-400 mt-2 truncate">
                {stats.isFullyComplete ? 'Ready for Audit' : 'In Progress'}
              </div>
            </div>
          </div>
        </section>

        {/* Certificate Section */}
        <section className="rounded-2xl border border-accent/30 bg-accent/5 p-6 md:p-8 space-y-4">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div>
              <span className="text-xs font-mono uppercase tracking-wider text-accent font-bold">
                Credential Verification
              </span>
              <h2 className="text-xl font-bold font-sans text-text-primary mt-1">
                Course Certificate of Completion
              </h2>
              <p className="text-xs sm:text-sm text-text-secondary mt-1">
                {isEligibleForCertificate
                  ? 'Congratulations! You have met all requirements. You may generate and export your certificate below.'
                  : `Complete all ${stats.totalLessons} lessons and required assessments to unlock your verified certificate.`}
              </p>
            </div>

            <button
              onClick={() => setShowCertificate(true)}
              className={`px-5 py-2.5 rounded-lg font-mono text-xs font-bold uppercase tracking-wider transition-colors border ${
                isEligibleForCertificate
                  ? 'bg-accent text-black hover:bg-accent/90 border-accent'
                  : 'bg-bg-primary text-text-muted border-border-subtle hover:text-text-primary'
              }`}
            >
              {isEligibleForCertificate ? '🎓 View Certificate' : '🔒 Preview Certificate'}
            </button>
          </div>
        </section>

        {/* Module-by-Module Progress Breakdown */}
        <section className="space-y-4">
          <h2 className="text-xl font-bold font-sans text-text-primary">
            Curriculum Breakdown
          </h2>

          <div className="space-y-3">
            {ALL_MODULES.map(module => {
              const modStats = progressService.getModuleCompletionStats(module.id);

              return (
                <div
                  key={module.id}
                  className="rounded-xl border border-border-subtle bg-bg-secondary/30 p-5 space-y-3"
                >
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                    <div className="flex items-center gap-3">
                      <span className="text-sm font-mono font-bold text-accent">
                        M{module.orderIndex}
                      </span>
                      <h3 className="text-sm sm:text-base font-bold text-text-primary">
                        {module.title}
                      </h3>
                      <span className="text-[10px] font-mono px-2 py-0.5 rounded border uppercase text-text-muted border-border-subtle">
                        {module.track}
                      </span>
                    </div>

                    <div className="flex items-center gap-3 text-xs font-mono">
                      <span className={modStats.isModuleComplete ? 'text-emerald-400 font-bold' : 'text-text-muted'}>
                        {modStats.completedLessons}/{modStats.totalLessons} Lessons ({modStats.percentage}%)
                      </span>
                      <Link
                        to={`/courses/teaming/modules/${module.slug}`}
                        className="text-accent hover:underline"
                      >
                        Module Page →
                      </Link>
                    </div>
                  </div>

                  {/* Progress bar */}
                  <div className="h-1.5 w-full bg-bg-primary rounded-full overflow-hidden border border-border-subtle/50">
                    <div
                      className={`h-full rounded-full transition-all ${
                        modStats.isModuleComplete ? 'bg-emerald-400' : 'bg-accent'
                      }`}
                      style={{ width: `${modStats.percentage}%` }}
                    />
                  </div>

                  {/* Lessons list checklist */}
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 pt-1 text-xs">
                    {module.lessons.map(lesson => {
                      const done = progressService.isLessonCompleted(lesson.id);
                      return (
                        <Link
                          key={lesson.slug}
                          to={`/courses/teaming/lessons/${lesson.slug}`}
                          className="flex items-center gap-2 p-1.5 rounded hover:bg-bg-primary/50 text-text-secondary hover:text-text-primary transition-colors"
                        >
                          <span className={done ? 'text-emerald-400 font-bold' : 'text-text-muted'}>
                            {done ? '✓' : '○'}
                          </span>
                          <span className="truncate">{lesson.title}</span>
                        </Link>
                      );
                    })}
                  </div>
                </div>
              );
            })}
          </div>
        </section>

        {/* Certificate Modal / Generator */}
        {showCertificate && (
          <div
            className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/85 backdrop-blur-md"
            onClick={() => setShowCertificate(false)}
          >
            <div
              className="bg-bg-secondary border border-border-subtle rounded-2xl max-w-3xl w-full p-6 sm:p-8 space-y-6 shadow-2xl overflow-y-auto max-h-[90vh]"
              onClick={e => e.stopPropagation()}
            >
              <div className="flex items-center justify-between border-b border-border-subtle pb-4">
                <span className="text-xs font-mono uppercase text-accent font-bold">
                  Certificate Preview & Generator
                </span>
                <button
                  onClick={() => setShowCertificate(false)}
                  className="text-text-muted hover:text-text-primary font-mono text-sm"
                >
                  ✕ Close
                </button>
              </div>

              {/* Name customization input */}
              <div className="flex items-center gap-3 text-xs font-mono">
                <label htmlFor="learner-name" className="text-text-secondary">
                  Recipient Name:
                </label>
                <input
                  id="learner-name"
                  type="text"
                  value={learnerName}
                  onChange={e => handleNameChange(e.target.value)}
                  className="flex-1 bg-bg-primary border border-border-subtle rounded px-3 py-1.5 text-text-primary focus:outline-none focus:border-accent"
                />
              </div>

              {/* Certificate Template Visual */}
              <div
                id="certificate-print-area"
                className="relative border-4 border-double border-accent/40 bg-bg-primary p-8 sm:p-12 text-center space-y-6 rounded-lg text-text-primary shadow-inner"
              >
                <div className="text-xs font-mono tracking-widest uppercase text-accent">
                  Certificate of Professional Achievement
                </div>

                <div className="text-2xl sm:text-3xl font-extrabold font-serif tracking-wide text-text-primary">
                  {learnerName}
                </div>

                <p className="text-xs sm:text-sm text-text-secondary max-w-lg mx-auto leading-relaxed">
                  has successfully completed the comprehensive professional curriculum and hands-on laboratory exercises in:
                </p>

                <div className="text-lg sm:text-xl font-bold font-sans text-accent max-w-md mx-auto">
                  {COURSE_METADATA.title}
                </div>

                <div className="text-xs font-mono text-text-muted space-y-1">
                  <div>Curriculum: Core, Red Teaming, Blue Teaming, & Purple Teaming</div>
                  <div>Issued by: Al Ameen N R (ALAMEEN.DEV)</div>
                  <div>Verification ID: SEC-{Math.abs(learnerName.split('').reduce((a, b) => (a << 5) - a + b.charCodeAt(0), 0)).toString(16).toUpperCase()}</div>
                </div>

                {!isEligibleForCertificate && (
                  <div className="absolute inset-0 bg-black/60 backdrop-blur-[2px] rounded flex flex-col items-center justify-center p-6 text-center">
                    <span className="text-3xl mb-2">🔒</span>
                    <h3 className="text-base font-bold text-text-primary">Certificate Locked</h3>
                    <p className="text-xs font-mono text-text-muted max-w-sm mt-1">
                      Complete all 11 modules to remove this watermark and verify your certificate.
                    </p>
                  </div>
                )}
              </div>

              {/* Actions */}
              <div className="flex justify-end gap-3 font-mono text-xs">
                <button
                  onClick={() => window.print()}
                  className="px-4 py-2 rounded bg-accent text-black font-bold hover:bg-accent/90"
                >
                  🖨 Print / Save as PDF
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Reset Confirmation Modal */}
        {showResetModal && (
          <div
            className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm"
            onClick={() => setShowResetModal(false)}
          >
            <div
              className="bg-bg-secondary border border-rose-500/40 rounded-2xl max-w-md w-full p-6 space-y-4 shadow-2xl"
              onClick={e => e.stopPropagation()}
            >
              <div className="flex items-center gap-2 text-rose-400 font-bold text-base">
                <span>⚠️</span>
                <span>Reset Learner Progress</span>
              </div>

              <p className="text-xs text-text-secondary leading-relaxed">
                This action will completely erase all your saved lesson completions, lab checkpoints, and quiz scores from your browser's local storage. This action cannot be undone.
              </p>

              <div className="space-y-1 text-xs font-mono">
                <label className="text-text-muted">
                  Type <span className="text-rose-400 font-bold">RESET</span> to confirm:
                </label>
                <input
                  type="text"
                  value={resetConfirmInput}
                  onChange={e => setResetConfirmInput(e.target.value)}
                  placeholder="RESET"
                  className="w-full bg-bg-primary border border-border-subtle rounded px-3 py-1.5 text-text-primary focus:outline-none focus:border-rose-500"
                />
              </div>

              <div className="flex justify-end gap-2 pt-2 font-mono text-xs">
                <button
                  onClick={() => setShowResetModal(false)}
                  className="px-4 py-2 rounded bg-bg-primary border border-border-subtle text-text-muted hover:text-text-primary"
                >
                  Cancel
                </button>
                <button
                  onClick={handleReset}
                  disabled={resetConfirmInput.trim().toUpperCase() !== 'RESET'}
                  className="px-4 py-2 rounded bg-rose-500 text-white font-bold disabled:opacity-40 disabled:cursor-not-allowed hover:bg-rose-600"
                >
                  Confirm Reset
                </button>
              </div>
            </div>
          </div>
        )}
      </main>
    </div>
  );
};
