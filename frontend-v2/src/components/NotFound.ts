// src/components/NotFound.ts
export function renderNotFound() {
  const app = document.getElementById('app');
  if (!app) return;
  app.innerHTML = `<section class="not-found"><h1>404 – No encontrado</h1><p>La página solicitada no existe.</p></section>`;
}
