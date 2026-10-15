import React from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import { useAuth } from './AuthContext';
import { FullPageSpinner } from '../ui/States';

/**
 * Gate for authenticated routes. Redirects anonymous visitors to /login,
 * preserving where they were headed so they land back after signing in.
 */
export function RequireAuth({ children }: { children: React.ReactNode }) {
  const { status, isAuthenticated } = useAuth();
  const location = useLocation();

  if (status === 'loading') {
    return <FullPageSpinner label="Checking your session…" />;
  }

  if (!isAuthenticated) {
    const next = encodeURIComponent(location.pathname + location.search);
    return <Navigate to={`/login?next=${next}`} replace />;
  }

  return <>{children}</>;
}
