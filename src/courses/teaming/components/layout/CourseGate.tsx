import React, { useMemo, useState } from 'react';
import { Link } from 'react-router-dom';
import { ShieldCheck, User, Mail, ArrowRight, Loader2, Lock, AlertCircle, ArrowLeft } from 'lucide-react';
import { COURSE_METADATA } from '../../data/courseMetadata';
import { ALL_MODULES } from '../../data/modulesManifest';
import { useLearner } from '../../context/LearnerContext';
import { validateEmail, validateName } from '../../services/enrollmentService';

export const CourseGate: React.FC = () => {
  const { enroll } = useLearner();

  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [touched, setTouched] = useState<{ name: boolean; email: boolean }>({ name: false, email: false });
  const [status, setStatus] = useState<'idle' | 'submitting'>('idle');
  const [formError, setFormError] = useState<string | null>(null);

  const totalLessons = useMemo(
    () => ALL_MODULES.reduce((acc, m) => acc + m.lessons.length, 0),
    []
  );

  const nameError = touched.name ? validateName(name) : null;
  const emailError = touched.email ? validateEmail(email) : null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setFormError(null);
    setTouched({ name: true, email: true });

    const firstError = validateName(name) || validateEmail(email);
    if (firstError) return;

    setStatus('submitting');
    try {
      await enroll(name, email);
      // On success the route guard swaps this gate out for the course.
    } catch (err) {
      setStatus('idle');
      setFormError(err instanceof Error ? err.message : 'Something went wrong. Please try again.');
    }
  };

  return (
    <div className="relative min-h-screen bg-bg-primary text-text-primary flex items-center justify-center px-4 py-10 overflow-hidden">
      {/* Ambient background */}
      <div className="pointer-events-none absolute inset-0 opacity-[0.035]"
        style={{
          backgroundImage:
            'linear-gradient(to right, #F5F5F5 1px, transparent 1px), linear-gradient(to bottom, #F5F5F5 1px, transparent 1px)',
          backgroundSize: '44px 44px'
        }}
        aria-hidden="true"
      />
      <div className="pointer-events-none absolute -top-32 left-1/2 -translate-x-1/2 w-[42rem] h-[42rem] bg-accent/[0.05] rounded-full blur-3xl" aria-hidden="true" />

      <div className="relative z-10 w-full max-w-5xl">
        {/* Back to portfolio */}
        <Link
          to="/"
          className="inline-flex items-center gap-1.5 mb-5 text-[11px] font-mono uppercase tracking-widest text-text-muted hover:text-text-primary transition-colors"
        >
          <ArrowLeft className="w-3.5 h-3.5" />
          Back to portfolio
        </Link>

        <div className="grid grid-cols-1 lg:grid-cols-2 rounded-2xl border border-border-subtle bg-bg-secondary/40 overflow-hidden">

          {/* ── Left: course identity ─────────────────────────────── */}
          <div className="p-7 sm:p-10 border-b lg:border-b-0 lg:border-r border-border-subtle space-y-6">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full border border-accent/30 bg-accent/10 text-[11px] font-mono text-accent uppercase tracking-wider">
              <ShieldCheck className="w-3.5 h-3.5" />
              <span>Version {COURSE_METADATA.version}</span>
            </div>

            <div className="space-y-3">
              <div className="text-[11px] font-mono uppercase tracking-[0.2em] text-text-muted">
                Access Control // Enrollment
              </div>
              <h1 className="font-display text-2xl sm:text-3xl font-extrabold tracking-tight leading-tight text-text-primary">
                {COURSE_METADATA.title}
              </h1>
              <p className="text-sm text-text-secondary leading-relaxed">
                {COURSE_METADATA.summary}
              </p>
            </div>

            {/* Stats strip */}
            <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-2 gap-3">
              {[
                { label: 'Modules', value: ALL_MODULES.length },
                { label: 'Lessons', value: totalLessons },
                { label: 'Pacing', value: COURSE_METADATA.estimatedWeeks },
                { label: 'Level', value: 'Self-paced' }
              ].map(stat => (
                <div key={stat.label} className="p-3 rounded border border-border-subtle bg-bg-primary/60">
                  <div className="text-[10px] font-mono uppercase tracking-wider text-text-muted">{stat.label}</div>
                  <div className="text-lg font-bold text-accent mt-0.5">{stat.value}</div>
                </div>
              ))}
            </div>

            {/* Safety notice */}
            <div className="rounded-xl border border-rose-500/25 bg-rose-500/5 p-4 space-y-2">
              <div className="flex items-center gap-2 text-rose-400 text-[11px] font-mono font-bold uppercase tracking-wider">
                <Lock className="w-3.5 h-3.5" />
                <span>Ethics &amp; Authorization Notice</span>
              </div>
              <p className="text-xs text-text-secondary leading-relaxed">
                All labs run on synthetic data and isolated course fixtures. Never test systems without
                written authorization from the owner.
              </p>
            </div>
          </div>

          {/* ── Right: enrollment form ────────────────────────────── */}
          <div className="p-7 sm:p-10 flex flex-col justify-center">
            <form onSubmit={handleSubmit} noValidate className="space-y-5">
              <div className="space-y-1">
                <h2 className="font-display text-lg font-bold text-text-primary">
                  Enroll to enter the course
                </h2>
                <p className="text-xs text-text-secondary leading-relaxed">
                  Tell us who you are so your progress, quiz scores, and certificate stay tied to you.
                  Asked once on this device.
                </p>
              </div>

              {/* Terminal-style hint */}
              <div className="rounded-lg border border-border-subtle bg-black/50 px-3.5 py-2.5 font-mono text-[11px] leading-relaxed">
                <span className="text-cyan-400">$</span>{' '}
                <span className="text-text-secondary">enroll --course</span>{' '}
                <span className="text-accent">teaming</span>
                <span className="text-text-muted"> --method=name,email</span>
              </div>

              {/* Name */}
              <div className="space-y-1.5">
                <label htmlFor="enroll-name" className="block text-[11px] font-mono uppercase tracking-wider text-text-secondary">
                  Full name
                </label>
                <div className="relative">
                  <User className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-text-muted" />
                  <input
                    id="enroll-name"
                    type="text"
                    value={name}
                    autoComplete="name"
                    autoFocus
                    placeholder="Ada Lovelace"
                    aria-invalid={!!nameError}
                    aria-describedby={nameError ? 'enroll-name-error' : undefined}
                    onChange={e => setName(e.target.value)}
                    onBlur={() => setTouched(t => ({ ...t, name: true }))}
                    className={`w-full rounded-lg bg-bg-primary border pl-10 pr-3 py-2.5 text-sm text-text-primary placeholder:text-text-muted/70 focus:outline-none focus:ring-1 transition-colors ${
                      nameError
                        ? 'border-rose-500/60 focus:border-rose-500 focus:ring-rose-500/40'
                        : 'border-border-subtle focus:border-accent focus:ring-accent/40'
                    }`}
                  />
                </div>
                {nameError && (
                  <p id="enroll-name-error" className="text-[11px] font-mono text-rose-400">{nameError}</p>
                )}
              </div>

              {/* Email */}
              <div className="space-y-1.5">
                <label htmlFor="enroll-email" className="block text-[11px] font-mono uppercase tracking-wider text-text-secondary">
                  Email address
                </label>
                <div className="relative">
                  <Mail className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-text-muted" />
                  <input
                    id="enroll-email"
                    type="email"
                    value={email}
                    autoComplete="email"
                    placeholder="you@example.com"
                    aria-invalid={!!emailError}
                    aria-describedby={emailError ? 'enroll-email-error' : undefined}
                    onChange={e => setEmail(e.target.value)}
                    onBlur={() => setTouched(t => ({ ...t, email: true }))}
                    className={`w-full rounded-lg bg-bg-primary border pl-10 pr-3 py-2.5 text-sm text-text-primary placeholder:text-text-muted/70 focus:outline-none focus:ring-1 transition-colors ${
                      emailError
                        ? 'border-rose-500/60 focus:border-rose-500 focus:ring-rose-500/40'
                        : 'border-border-subtle focus:border-accent focus:ring-accent/40'
                    }`}
                  />
                </div>
                {emailError && (
                  <p id="enroll-email-error" className="text-[11px] font-mono text-rose-400">{emailError}</p>
                )}
              </div>

              {/* Form-level error */}
              {formError && (
                <div role="alert" className="flex items-start gap-2 rounded-lg border border-rose-500/30 bg-rose-500/10 px-3.5 py-2.5 text-xs text-rose-300">
                  <AlertCircle className="w-4 h-4 shrink-0 mt-0.5" />
                  <span>{formError}</span>
                </div>
              )}

              {/* Submit */}
              <button
                type="submit"
                disabled={status === 'submitting'}
                className="w-full inline-flex items-center justify-center gap-2 rounded-lg bg-accent text-black font-mono text-xs font-bold uppercase tracking-wider px-6 py-3.5 hover:bg-accent/90 disabled:opacity-60 disabled:cursor-not-allowed transition-all shadow-lg shadow-accent/10"
              >
                {status === 'submitting' ? (
                  <>
                    <Loader2 className="w-4 h-4 animate-spin" />
                    Enrolling…
                  </>
                ) : (
                  <>
                    Enroll &amp; enter course
                    <ArrowRight className="w-4 h-4" />
                  </>
                )}
              </button>

              <p className="text-[10px] font-mono text-text-muted leading-relaxed">
                Your details are used to identify your progress and are stored locally on this device.
                No password required.
              </p>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
};
