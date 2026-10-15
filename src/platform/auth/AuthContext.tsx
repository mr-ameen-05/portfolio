import React, {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
} from 'react';
import { ApiError, get, post } from '../api/client';

export interface AuthUser {
  id: number;
  email: string;
  name: string;
  role: string;
  email_verified: boolean;
}

export type Tier = 'registered' | 'enrolled';
export type AccessLevel = 'guest' | Tier;

export interface Entitlements {
  course: string;
  tier: Tier | null;
  access: AccessLevel;
}

interface MeResponse {
  authenticated: boolean;
  user?: AuthUser;
  csrf?: string;
  entitlements?: Entitlements;
}

interface AuthResponse {
  success: boolean;
  message?: string;
  user: AuthUser;
  csrf: string;
  entitlements: Entitlements;
}

interface MessageResponse {
  success: boolean;
  message: string;
}

interface AuthContextValue {
  status: 'loading' | 'ready';
  /** True when the API could not be reached (e.g. not deployed / offline). */
  unavailable: boolean;
  user: AuthUser | null;
  entitlements: Entitlements | null;
  isAuthenticated: boolean;
  isVerified: boolean;
  csrf: string | null;
  hasTier: (tier: 'public' | Tier) => boolean;
  refresh: () => Promise<void>;
  login: (email: string, password: string) => Promise<void>;
  register: (name: string, email: string, password: string) => Promise<void>;
  logout: () => Promise<void>;
  signOut: () => Promise<void>;
  requestReset: (email: string) => Promise<string>;
  resetPassword: (token: string, password: string) => Promise<string>;
  verifyEmail: (token: string) => Promise<string>;
}

const RANK: Record<AccessLevel, number> = { guest: 0, registered: 1, enrolled: 2 };

const AuthContext = createContext<AuthContextValue | undefined>(undefined);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [status, setStatus] = useState<'loading' | 'ready'>('loading');
  const [unavailable, setUnavailable] = useState(false);
  const [user, setUser] = useState<AuthUser | null>(null);
  const [csrf, setCsrf] = useState<string | null>(null);
  const [entitlements, setEntitlements] = useState<Entitlements | null>(null);

  const apply = useCallback(
    (nextUser: AuthUser | null, token: string | null, ent: Entitlements | null) => {
      setUser(nextUser);
      setCsrf(token);
      setEntitlements(ent);
    },
    []
  );

  const refresh = useCallback(async () => {
    try {
      const me = await get<MeResponse>('auth-me.php');
      setUnavailable(false);
      if (me.authenticated && me.user) {
        apply(me.user, me.csrf ?? null, me.entitlements ?? null);
      } else {
        apply(null, null, me.entitlements ?? null);
      }
    } catch (err) {
      if (err instanceof ApiError && err.isNetwork) {
        setUnavailable(true);
      }
      apply(null, null, null);
    } finally {
      setStatus('ready');
    }
  }, [apply]);

  useEffect(() => {
    void refresh();
  }, [refresh]);

  const login = useCallback(
    async (email: string, password: string) => {
      const res = await post<AuthResponse>('auth-login.php', { email, password });
      setUnavailable(false);
      apply(res.user, res.csrf, res.entitlements);
      setStatus('ready');
    },
    [apply]
  );

  const register = useCallback(
    async (name: string, email: string, password: string) => {
      const res = await post<AuthResponse>('auth-register.php', { name, email, password });
      setUnavailable(false);
      apply(res.user, res.csrf, res.entitlements);
      setStatus('ready');
    },
    [apply]
  );

  const logout = useCallback(async () => {
    try {
      await post('auth-logout.php', {}, csrf);
    } catch {
      // Best effort — clear locally regardless.
    }
    apply(null, null, null);
  }, [apply, csrf]);

  const requestReset = useCallback(async (email: string) => {
    const res = await post<MessageResponse>('auth-request-reset.php', { email });
    return res.message;
  }, []);

  const resetPassword = useCallback(async (token: string, password: string) => {
    const res = await post<MessageResponse>('auth-reset-password.php', { token, password });
    return res.message;
  }, []);

  const verifyEmail = useCallback(async (token: string) => {
    const res = await post<MessageResponse>('auth-verify-email.php', { token });
    return res.message;
  }, []);

  const hasTier = useCallback(
    (tier: 'public' | Tier) => {
      if (tier === 'public') return true;
      const access = entitlements?.access ?? 'guest';
      return RANK[access] >= RANK[tier];
    },
    [entitlements]
  );

  const value = useMemo<AuthContextValue>(
    () => ({
      status,
      unavailable,
      user,
      entitlements,
      isAuthenticated: user !== null,
      isVerified: Boolean(user?.email_verified),
      csrf,
      hasTier,
      refresh,
      login,
      register,
      logout,
      signOut: logout,
      requestReset,
      resetPassword,
      verifyEmail,
    }),
    [
      status,
      unavailable,
      user,
      entitlements,
      hasTier,
      refresh,
      login,
      register,
      logout,
      requestReset,
      resetPassword,
      verifyEmail,
      csrf,
    ]
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth(): AuthContextValue {
  const ctx = useContext(AuthContext);
  if (ctx === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return ctx;
}
