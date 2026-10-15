import React, { useEffect, useState } from 'react';
import { Link, useNavigate, useSearchParams } from 'react-router-dom';
import { ApiError } from '../api/client';
import { useAuth } from '../auth/AuthContext';
import { Alert, Spinner } from '../ui/States';

// ─────────────────────────────── shell ──────────────────────────────────────

function AuthShell({
  eyebrow,
  title,
  subtitle,
  children,
  footer,
}: {
  eyebrow: string;
  title: string;
  subtitle: string;
  children: React.ReactNode;
  footer?: React.ReactNode;
}) {
  return (
    <main className="min-h-[80vh] px-6 md:px-12 lg:px-24 py-20 flex justify-center">
      <div className="w-full max-w-md">
        <p className="text-xs font-mono text-text-muted tracking-widest uppercase mb-4">{eyebrow}</p>
        <h1 className="font-display text-4xl sm:text-5xl tracking-tight text-text-primary mb-3">
          {title}
        </h1>
        <p className="text-text-secondary text-sm leading-relaxed mb-8">{subtitle}</p>
        <div className="rounded-2xl bg-bg-secondary border border-border-subtle p-6 sm:p-8">
          {children}
        </div>
        {footer && <div className="mt-6 text-xs font-mono text-text-muted">{footer}</div>}
      </div>
    </main>
  );
}

function Field({
  label,
  error,
  ...props
}: React.InputHTMLAttributes<HTMLInputElement> & { label: string; error?: string }) {
  const id = React.useId();
  return (
    <div className="mb-4">
      <label htmlFor={id} className="block text-[11px] font-mono uppercase tracking-widest text-text-muted mb-2">
        {label}
      </label>
      <input
        id={id}
        {...props}
        aria-invalid={Boolean(error)}
        className={`w-full rounded-xl bg-bg-primary border px-4 py-3 text-sm text-text-primary font-mono outline-none transition-colors focus:border-accent ${
          error ? 'border-red-500/50' : 'border-border-subtle'
        }`}
      />
      {error && <p className="mt-1.5 text-[11px] font-mono text-red-400">{error}</p>}
    </div>
  );
}

function SubmitButton({ busy, children }: { busy: boolean; children: React.ReactNode }) {
  return (
    <button
      type="submit"
      disabled={busy}
      className="w-full mt-2 inline-flex items-center justify-center gap-2 rounded-xl bg-accent text-black font-mono font-bold uppercase tracking-wider text-xs px-6 py-3.5 hover:bg-accent/90 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
    >
      {busy && <Spinner />}
      {children}
    </button>
  );
}

function useApiErrorState() {
  const [error, setError] = useState<string | null>(null);
  const [fields, setFields] = useState<Record<string, string>>({});
  const handle = (err: unknown) => {
    if (err instanceof ApiError) {
      setError(err.message);
      setFields(err.fields ?? {});
    } else {
      setError('Something went wrong. Please try again.');
    }
  };
  const reset = () => {
    setError(null);
    setFields({});
  };
  return { error, fields, handle, reset };
}

/** Restricts post-login redirects to same-origin paths (no open redirects). */
function safeNext(raw: string | null): string {
  if (raw && raw.startsWith('/') && !raw.startsWith('//')) return raw;
  return '/dashboard';
}

// ─────────────────────────────── login ──────────────────────────────────────

export function LoginPage() {
  const { login, unavailable } = useAuth();
  const navigate = useNavigate();
  const [params] = useSearchParams();
  const next = safeNext(params.get('next'));

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [busy, setBusy] = useState(false);
  const { error, fields, handle, reset } = useApiErrorState();

  async function onSubmit(event: React.FormEvent) {
    event.preventDefault();
    setBusy(true);
    reset();
    try {
      await login(email.trim(), password);
      navigate(next, { replace: true });
    } catch (err) {
      handle(err);
    } finally {
      setBusy(false);
    }
  }

  return (
    <AuthShell
      eyebrow="Account / Sign in"
      title="Welcome back"
      subtitle="Sign in to open your course modules, labs and saved progress."
      footer={
        <>
          New here?{' '}
          <Link to="/register" className="text-accent hover:underline">
            Create a free account
          </Link>
        </>
      }
    >
      {unavailable && (
        <div className="mb-5">
          <Alert tone="info">
            Accounts need the PHP API and database. If you are browsing a static preview, sign-in
            will not work yet.
          </Alert>
        </div>
      )}
      <form onSubmit={onSubmit} noValidate>
        {error && (
          <div className="mb-5">
            <Alert tone="error">{error}</Alert>
          </div>
        )}
        <Field
          label="Email"
          type="email"
          autoComplete="email"
          required
          value={email}
          error={fields.email}
          onChange={(e) => setEmail(e.target.value)}
        />
        <Field
          label="Password"
          type="password"
          autoComplete="current-password"
          required
          value={password}
          error={fields.password}
          onChange={(e) => setPassword(e.target.value)}
        />
        <SubmitButton busy={busy}>Sign in</SubmitButton>
      </form>
      <p className="mt-4 text-center text-[11px] font-mono">
        <Link to="/forgot-password" className="text-text-muted hover:text-accent transition-colors">
          Forgot your password?
        </Link>
      </p>
    </AuthShell>
  );
}

// ────────────────────────────── register ────────────────────────────────────

export function RegisterPage() {
  const { register } = useAuth();
  const navigate = useNavigate();

  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [busy, setBusy] = useState(false);
  const { error, fields, handle, reset } = useApiErrorState();

  async function onSubmit(event: React.FormEvent) {
    event.preventDefault();
    setBusy(true);
    reset();
    try {
      await register(name.trim(), email.trim(), password);
      navigate('/verify-email', { replace: true });
    } catch (err) {
      handle(err);
    } finally {
      setBusy(false);
    }
  }

  return (
    <AuthShell
      eyebrow="Account / Create"
      title="Create your account"
      subtitle="Free accounts unlock the registered tier: the orientation modules, glossary and resource library."
      footer={
        <>
          Already have an account?{' '}
          <Link to="/login" className="text-accent hover:underline">
            Sign in
          </Link>
        </>
      }
    >
      <form onSubmit={onSubmit} noValidate>
        {error && (
          <div className="mb-5">
            <Alert tone="error">{error}</Alert>
          </div>
        )}
        <Field
          label="Name"
          type="text"
          autoComplete="name"
          required
          value={name}
          error={fields.name}
          onChange={(e) => setName(e.target.value)}
        />
        <Field
          label="Email"
          type="email"
          autoComplete="email"
          required
          value={email}
          error={fields.email}
          onChange={(e) => setEmail(e.target.value)}
        />
        <Field
          label="Password"
          type="password"
          autoComplete="new-password"
          required
          value={password}
          error={fields.password}
          onChange={(e) => setPassword(e.target.value)}
        />
        <p className="text-[11px] font-mono text-text-muted mb-2">
          At least 10 characters, including a letter and a number.
        </p>
        <SubmitButton busy={busy}>Create account</SubmitButton>
      </form>
    </AuthShell>
  );
}

// ─────────────────────────── forgot password ────────────────────────────────

export function ForgotPasswordPage() {
  const { requestReset } = useAuth();
  const [email, setEmail] = useState('');
  const [busy, setBusy] = useState(false);
  const [sent, setSent] = useState<string | null>(null);
  const { error, handle, reset } = useApiErrorState();

  async function onSubmit(event: React.FormEvent) {
    event.preventDefault();
    setBusy(true);
    reset();
    try {
      const message = await requestReset(email.trim());
      setSent(message);
    } catch (err) {
      handle(err);
    } finally {
      setBusy(false);
    }
  }

  return (
    <AuthShell
      eyebrow="Account / Reset"
      title="Reset your password"
      subtitle="Enter your email and we will send a reset link if an account exists."
      footer={
        <Link to="/login" className="text-accent hover:underline">
          Back to sign in
        </Link>
      }
    >
      {sent ? (
        <Alert tone="success">{sent}</Alert>
      ) : (
        <form onSubmit={onSubmit} noValidate>
          {error && (
            <div className="mb-5">
              <Alert tone="error">{error}</Alert>
            </div>
          )}
          <Field
            label="Email"
            type="email"
            autoComplete="email"
            required
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />
          <SubmitButton busy={busy}>Send reset link</SubmitButton>
        </form>
      )}
    </AuthShell>
  );
}

// ─────────────────────────── reset password ─────────────────────────────────

export function ResetPasswordPage() {
  const { resetPassword } = useAuth();
  const navigate = useNavigate();
  const [params] = useSearchParams();
  const token = params.get('token') ?? '';

  const [password, setPassword] = useState('');
  const [confirm, setConfirm] = useState('');
  const [busy, setBusy] = useState(false);
  const [done, setDone] = useState<string | null>(null);
  const { error, fields, handle, reset } = useApiErrorState();

  async function onSubmit(event: React.FormEvent) {
    event.preventDefault();
    reset();
    if (password !== confirm) {
      handle(new ApiError({ status: 0, message: 'Passwords do not match.' }));
      return;
    }
    setBusy(true);
    try {
      const message = await resetPassword(token, password);
      setDone(message);
      setTimeout(() => navigate('/login', { replace: true }), 1500);
    } catch (err) {
      handle(err);
    } finally {
      setBusy(false);
    }
  }

  return (
    <AuthShell
      eyebrow="Account / Reset"
      title="Choose a new password"
      subtitle="Pick a strong password you have not used before."
      footer={
        <Link to="/login" className="text-accent hover:underline">
          Back to sign in
        </Link>
      }
    >
      {!token ? (
        <Alert tone="error">This reset link is missing its token. Request a new link.</Alert>
      ) : done ? (
        <Alert tone="success">{done} Redirecting to sign in…</Alert>
      ) : (
        <form onSubmit={onSubmit} noValidate>
          {error && (
            <div className="mb-5">
              <Alert tone="error">{error}</Alert>
            </div>
          )}
          <Field
            label="New password"
            type="password"
            autoComplete="new-password"
            required
            value={password}
            error={fields.password}
            onChange={(e) => setPassword(e.target.value)}
          />
          <Field
            label="Confirm password"
            type="password"
            autoComplete="new-password"
            required
            value={confirm}
            onChange={(e) => setConfirm(e.target.value)}
          />
          <SubmitButton busy={busy}>Update password</SubmitButton>
        </form>
      )}
    </AuthShell>
  );
}

// ─────────────────────────── verify email ───────────────────────────────────

type VerifyState = 'idle' | 'verifying' | 'done' | 'error';

export function VerifyEmailPage() {
  const { verifyEmail, isAuthenticated, user } = useAuth();
  const [params] = useSearchParams();
  const token = params.get('token') ?? '';
  const [state, setState] = useState<VerifyState>(token ? 'verifying' : 'idle');
  const [message, setMessage] = useState<string>('');

  useEffect(() => {
    if (!token) return;
    let active = true;
    void (async () => {
      try {
        const result = await verifyEmail(token);
        if (active) {
          setMessage(result);
          setState('done');
        }
      } catch (err) {
        if (active) {
          setMessage(err instanceof ApiError ? err.message : 'Verification failed.');
          setState('error');
        }
      }
    })();
    return () => {
      active = false;
    };
  }, [token, verifyEmail]);

  return (
    <AuthShell
      eyebrow="Account / Verify"
      title={token ? 'Verifying your email' : 'Check your inbox'}
      subtitle="Verifying your email keeps your account recoverable."
      footer={
        <Link to={isAuthenticated ? '/dashboard' : '/login'} className="text-accent hover:underline">
          {isAuthenticated ? 'Go to your dashboard' : 'Back to sign in'}
        </Link>
      }
    >
      {state === 'verifying' && (
        <div className="flex items-center gap-3 text-sm font-mono text-text-secondary">
          <Spinner /> Verifying…
        </div>
      )}
      {state === 'done' && <Alert tone="success">{message}</Alert>}
      {state === 'error' && <Alert tone="error">{message}</Alert>}
      {state === 'idle' && (
        <div className="space-y-4 text-sm text-text-secondary leading-relaxed">
          <Alert tone="info">
            We sent a verification link{user?.email ? ` to ${user.email}` : ''}. Open it to confirm
            your address.
          </Alert>
          <p className="text-xs font-mono text-text-muted">
            The link expires in 24 hours. You can keep using the free tier in the meantime.
          </p>
        </div>
      )}
    </AuthShell>
  );
}
