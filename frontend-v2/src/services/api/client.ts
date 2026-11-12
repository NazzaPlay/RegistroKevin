// src/services/api/client.ts
// Centralizado wrapper para llamadas al backend.
// Base URL relativa a /api (Cloudflare Pages Functions proxy).

export type HttpMethod = 'GET' | 'POST' | 'PUT' | 'PATCH' | 'DELETE';

interface RequestOptions<T> {
  method?: HttpMethod;
  body?: T;
  headers?: Record<string, string>;
  // Señala si la petición necesita autenticación (cookies incluidas)
  auth?: boolean;
}

let csrfToken: string = '';

/**
 * Obtiene (o refresca) el token CSRF de la sesión actual.
 * Se llama automáticamente antes de cualquier petición que requiera CSRF.
 */
export async function getCsrfToken(): Promise<string> {
  if (csrfToken) return csrfToken;
  const resp = await fetch('/api/auth/csrf', { credentials: 'same-origin' });
  if (!resp.ok) throw new Error('CSRF fetch failed');
  const data = await resp.json();
  csrfToken = data.csrfToken;
  return csrfToken;
}

export async function apiRequest<T = any, B = any>(path: string, opts: RequestOptions<B> = {}): Promise<T> {
  const method = opts.method ?? (opts.body ? 'POST' : 'GET');
  const headers: Record<string, string> = {
    'Accept': 'application/json',
    ...(opts.headers ?? {}),
  };

  if (opts.body) {
    headers['Content-Type'] = 'application/json';
  }

  // Si la petición requiere CSRF (escritura), incluir el header
  if (['POST', 'PUT', 'PATCH', 'DELETE'].includes(method)) {
    const token = await getCsrfToken();
    headers['X-CSRF-Token'] = token as string;
  }

  const response = await fetch(`/api${path}`, {
    method,
    headers,
    credentials: 'same-origin', // envía cookies de sesión
    body: opts.body ? JSON.stringify(opts.body) : undefined,
  });

  if (!response.ok) {
    const err = await response.text();
    throw new Error(`API error ${response.status}: ${err}`);
  }

  // 204 No Content
  if (response.status === 204) return undefined as any;
  return (await response.json()) as T;
}
