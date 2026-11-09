// functions/api/[[path]].js – Cloudflare Pages Function
// Proxy seguro para /api/* → backend (Caddy en DuckDNS)

export const onRequest = async ({ request, env }) => {
  const secret = env.BACKEND_PROXY_SECRET;   // solo del entorno de Pages (secreto cifrado)
  const url = new URL(request.url);

  // lista explícita de endpoints permitidos (mapeo exacto)
  const allowed = [
    '/api/health',
    '/api/auth/login',
    '/api/auth/logout',
    '/api/auth/me',
    '/api/auth/csrf',
    // añadir aquí cualquier nuevo endpoint autorizado en la fase 2
  ];

  // validación exacta de pathname (no startsWith que permita prefijos extra)
  const matched = allowed.find(p => url.pathname === p);
  if (!matched) {
    return new Response('Not allowed', { status: 404 });
  }

  // eliminar cualquier X‑Backend‑Secret que el cliente haya enviado
  const reqHeaders = new Headers(request.headers);
  reqHeaders.delete('X-Backend-Secret');
  reqHeaders.delete('origin');
  reqHeaders.delete('referer');
  reqHeaders.delete('x-forwarded-for');
  reqHeaders.delete('x-forwarded-host');
  reqHeaders.delete('x-forwarded-proto');

  // inyectar el secret que el backend espera (Caddy lo validará)
  reqHeaders.set('X-Backend-Secret', secret);

  // construir la URL del backend (el dominio DuckDNS se define en env)
  const upstream = env.BACKEND_URL; // ej. https://api.patagonia.duckdns.org
  const target = new URL(upstream + url.pathname.replace(/^\/api/, '') + url.search);

  const init = {
    method: request.method,
    headers: reqHeaders,
    body: request.body,
    redirect: 'manual',
  };

  const resp = await fetch(target, init);

  // limpiar cabeceras que provienen del backend
  const outHeaders = new Headers(resp.headers);
  outHeaders.delete('x-powered-by');
  outHeaders.set('Cache-Control', 'no-store');

  // propagar cookies sin alteración
  const setCookie = resp.headers.getAll ? resp.headers.getAll('set-cookie') : resp.headers.get('set-cookie');
  if (setCookie) outHeaders.set('Set-Cookie', setCookie);

  return new Response(resp.body, { status: resp.status, headers: outHeaders });
};