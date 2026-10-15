/**
 * Thin fetch wrapper for the same-origin PHP API.
 *
 * Cookies carry the session (sent with `credentials: 'include'`); mutating
 * requests also send the CSRF token issued by /api/auth-me.php. Failures are
 * normalised into ApiError so callers can distinguish auth/permission/network
 * problems without parsing responses themselves.
 */

export interface ApiErrorPayload {
  status: number;
  code?: string;
  message: string;
  fields?: Record<string, string>;
  requires?: string;
}

export class ApiError extends Error {
  readonly status: number;
  readonly code?: string;
  readonly fields?: Record<string, string>;
  readonly requires?: string;

  constructor(payload: ApiErrorPayload) {
    super(payload.message);
    this.name = 'ApiError';
    this.status = payload.status;
    this.code = payload.code;
    this.fields = payload.fields;
    this.requires = payload.requires;
  }

  /** True when the request never reached the API (offline / not deployed). */
  get isNetwork(): boolean {
    return this.status === 0;
  }
}

const BASE = '/api';

interface RequestOptions {
  method?: 'GET' | 'POST';
  body?: unknown;
  csrf?: string | null;
  signal?: AbortSignal;
}

export async function request<T>(path: string, options: RequestOptions = {}): Promise<T> {
  const headers: Record<string, string> = { Accept: 'application/json' };
  let body: string | undefined;

  if (options.body !== undefined) {
    headers['Content-Type'] = 'application/json';
    body = JSON.stringify(options.body);
  }
  if (options.csrf) {
    headers['X-CSRF-Token'] = options.csrf;
  }

  let response: Response;
  try {
    response = await fetch(`${BASE}/${path}`, {
      method: options.method ?? 'GET',
      headers,
      body,
      credentials: 'include',
      signal: options.signal,
    });
  } catch {
    throw new ApiError({
      status: 0,
      code: 'network',
      message: 'We could not reach the server. Check your connection and try again.',
    });
  }

  const raw = await response.text();
  let data: unknown = null;
  if (raw) {
    try {
      data = JSON.parse(raw);
    } catch {
      data = null;
    }
  }
  const obj = (data ?? {}) as Record<string, unknown>;

  if (!response.ok) {
    throw new ApiError({
      status: response.status,
      code: typeof obj.code === 'string' ? obj.code : undefined,
      message: typeof obj.error === 'string' ? obj.error : 'Something went wrong. Please try again.',
      fields:
        obj.fields && typeof obj.fields === 'object'
          ? (obj.fields as Record<string, string>)
          : undefined,
      requires: typeof obj.requires === 'string' ? obj.requires : undefined,
    });
  }

  return data as T;
}

export const get = <T,>(path: string, signal?: AbortSignal): Promise<T> =>
  request<T>(path, { signal });

export const post = <T,>(path: string, body?: unknown, csrf?: string | null): Promise<T> =>
  request<T>(path, { method: 'POST', body, csrf });
