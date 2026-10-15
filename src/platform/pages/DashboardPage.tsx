import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { ApiError, get } from '../api/client';
import { useAuth } from '../auth/AuthContext';
import { AccessBadge, Alert, FullPageSpinner } from '../ui/States';

interface Summary {
  course_slug: string;
  required_lessons: number;
  required_completed: number;
  lessons_completed: number;
  percent: number;
  minutes_completed: number;
  quizzes_passed: number;
  labs_completed: number;
  next_lesson: { slug: string; title: string } | null;
  access: string;
}

function StatCard({ label, value, hint }: { label: string; value: string; hint?: string }) {
  return (
    <div className="rounded-2xl bg-bg-secondary border border-border-subtle p-6">
      <p className="text-[11px] font-mono uppercase tracking-widest text-text-muted mb-3">{label}</p>
      <p className="font-display text-4xl text-text-primary leading-none">{value}</p>
      {hint && <p className="mt-2 text-[11px] font-mono text-text-muted">{hint}</p>}
    </div>
  );
}

export function DashboardPage() {
  const { user, entitlements, unavailable, isVerified, logout } = useAuth();

  const [summary, setSummary] = useState<Summary | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let active = true;
    void (async () => {
      try {
        const res = await get<{ summary: Summary }>('progress-summary.php?course=teaming');
        if (active) setSummary(res.summary);
      } catch (err) {
        if (active) {
          setError(err instanceof ApiError ? err.message : 'Could not load your progress.');
        }
      } finally {
        if (active) setLoading(false);
      }
    })();
    return () => {
      active = false;
    };
  }, []);

  if (loading) {
    return <FullPageSpinner label="Loading your dashboard…" />;
  }

  const access = entitlements?.access ?? 'guest';

  return (
    <main className="px-6 md:px-12 lg:px-24 py-20 max-w-6xl mx-auto">
      <header className="flex flex-col sm:flex-row sm:items-end sm:justify-between gap-6 mb-12">
        <div>
          <p className="text-xs font-mono text-text-muted tracking-widest uppercase mb-4">
            Learner dashboard
          </p>
          <h1 className="font-display text-4xl sm:text-5xl tracking-tight text-text-primary mb-3">
            {user ? `Hi, ${user.name.split(' ')[0]}` : 'Your dashboard'}
          </h1>
          <div className="flex items-center gap-3">
            <AccessBadge tier={access} />
            {!isVerified && (
              <span className="text-[10px] font-mono uppercase tracking-wider px-2.5 py-1 rounded border border-amber-400/40 text-amber-300 bg-amber-400/10">
                Email unverified
              </span>
            )}
          </div>
        </div>
        <button
          type="button"
          onClick={() => void logout()}
          className="self-start text-xs font-mono uppercase tracking-widest text-text-muted hover:text-accent transition-colors"
        >
          Sign out
        </button>
      </header>

      {unavailable && (
        <div className="mb-8">
          <Alert tone="info">
            Progress needs the PHP API and database. In a static preview, this dashboard will stay
            empty.
          </Alert>
        </div>
      )}
      {!isVerified && user && (
        <div className="mb-8">
          <Alert tone="info">
            Your email is not verified yet.{' '}
            <Link to="/verify-email" className="text-accent hover:underline">
              Resend the link
            </Link>{' '}
            to keep your account recoverable.
          </Alert>
        </div>
      )}
      {error && !unavailable && (
        <div className="mb-8">
          <Alert tone="error">{error}</Alert>
        </div>
      )}

      {summary && (
        <>
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-10">
            <StatCard
              label="Progress"
              value={`${summary.percent}%`}
              hint={`${summary.required_completed}/${summary.required_lessons} required lessons`}
            />
            <StatCard label="Lessons done" value={String(summary.lessons_completed)} />
            <StatCard label="Quizzes passed" value={String(summary.quizzes_passed)} />
            <StatCard label="Labs completed" value={String(summary.labs_completed)} />
          </div>

          <div className="rounded-2xl bg-bg-secondary border border-border-subtle p-6 sm:p-8 flex flex-col sm:flex-row sm:items-center justify-between gap-6">
            <div>
              <p className="text-[11px] font-mono uppercase tracking-widest text-text-muted mb-2">
                {summary.next_lesson ? 'Continue where you left off' : 'You are caught up'}
              </p>
              <p className="text-text-primary font-sans text-lg">
                {summary.next_lesson ? summary.next_lesson.title : 'Every accessible lesson is complete.'}
              </p>
            </div>
            <Link
              to={summary.next_lesson ? `/courses/teaming/lessons/${summary.next_lesson.slug}` : '/courses/teaming'}
              className="shrink-0 inline-flex items-center gap-2 rounded-xl bg-accent text-black font-mono font-bold uppercase tracking-wider text-xs px-6 py-3.5 hover:bg-accent/90 transition-colors"
            >
              {summary.next_lesson ? 'Continue' : 'Open course'}
            </Link>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mt-10">
            <Link to="/courses/teaming" className="rounded-2xl bg-bg-secondary border border-border-subtle p-5 hover:border-accent/40 transition-colors">
              <p className="font-sans font-semibold text-text-primary">Course home</p>
              <p className="text-xs font-mono text-text-muted mt-1">Modules, labs and assessments</p>
            </Link>
            <Link to="/courses/teaming/resources" className="rounded-2xl bg-bg-secondary border border-border-subtle p-5 hover:border-accent/40 transition-colors">
              <p className="font-sans font-semibold text-text-primary">Resource library</p>
              <p className="text-xs font-mono text-text-muted mt-1">Templates, checklists, rubrics</p>
            </Link>
            <Link to="/courses/teaming/glossary" className="rounded-2xl bg-bg-secondary border border-border-subtle p-5 hover:border-accent/40 transition-colors">
              <p className="font-sans font-semibold text-text-primary">Glossary</p>
              <p className="text-xs font-mono text-text-muted mt-1">Core security vocabulary</p>
            </Link>
          </div>
        </>
      )}
    </main>
  );
}
