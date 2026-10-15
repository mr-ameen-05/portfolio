import React from 'react';

export function Spinner({ className = '' }: { className?: string }) {
  return (
    <span
      className={`inline-block h-4 w-4 animate-spin rounded-full border-2 border-text-muted/40 border-t-accent ${className}`}
      aria-hidden="true"
    />
  );
}

export function FullPageSpinner({ label = 'Loading…' }: { label?: string }) {
  return (
    <div
      className="flex min-h-[60vh] flex-col items-center justify-center gap-4"
      role="status"
      aria-live="polite"
    >
      <Spinner className="h-6 w-6" />
      <p className="text-xs font-mono uppercase tracking-widest text-text-muted">{label}</p>
    </div>
  );
}

type Tone = 'error' | 'success' | 'info';

const TONE: Record<Tone, string> = {
  error: 'border-red-500/40 bg-red-500/10 text-red-300',
  success: 'border-accent/40 bg-accent/10 text-accent',
  info: 'border-border-subtle bg-bg-secondary text-text-secondary',
};

export function Alert({ tone = 'info', children }: { tone?: Tone; children: React.ReactNode }) {
  return (
    <div
      role={tone === 'error' ? 'alert' : 'status'}
      className={`rounded-xl border px-4 py-3 text-sm font-mono leading-relaxed ${TONE[tone]}`}
    >
      {children}
    </div>
  );
}

const BADGE: Record<string, string> = {
  guest: 'border-border-subtle text-text-muted bg-bg-secondary',
  registered: 'border-accent/40 text-accent bg-accent/10',
  enrolled: 'border-accent/60 text-black bg-accent',
};

const BADGE_LABEL: Record<string, string> = {
  guest: 'Preview',
  registered: 'Registered',
  enrolled: 'Enrolled',
};

export function AccessBadge({
  tier,
  className = '',
}: {
  tier: string;
  className?: string;
}) {
  return (
    <span
      className={`text-[10px] font-mono font-bold uppercase tracking-wider px-2.5 py-1 rounded border ${
        BADGE[tier] ?? BADGE.guest
      } ${className}`}
    >
      {BADGE_LABEL[tier] ?? tier}
    </span>
  );
}

export function LockedNote({ requires }: { requires: 'registered' | 'enrolled' }) {
  const copy =
    requires === 'enrolled'
      ? 'Enrolment required to open this part of the course.'
      : 'Create a free account to open this part of the course.';
  return (
    <div className="rounded-xl border border-border-subtle bg-bg-secondary px-4 py-3 flex items-center gap-3">
      <span aria-hidden="true">🔒</span>
      <p className="text-xs font-mono text-text-secondary leading-relaxed">{copy}</p>
    </div>
  );
}
