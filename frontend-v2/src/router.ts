// Simple hash router for the SPA
// Maps #/path to a render function that mounts into #app

interface Route {
  path: string;
  render: () => void;
  protected?: boolean;
  role?: 'ADMIN' | 'DRIVER';
}

const routes: Route[] = [];

import { isAuthenticated, getUser } from './state/auth';

export function register(path: string, render: () => void, options?: { protected?: boolean; role?: 'ADMIN' | 'DRIVER' }) {
  routes.push({ path, render, protected: options?.protected, role: options?.role });
}

function resolve() {
  const hash = location.hash.replace(/^#/, "");
  const route = routes.find(r => r.path === hash);
  if (!route) {
    // 404 fallback
    const notFound = routes.find(r => r.path === '*');
    if (notFound) notFound.render();
    return;
  }
  if (route.protected && !isAuthenticated()) {
    // redirect to login
    location.hash = '#/login';
    return;
  }
  if (route.role && !((getUser()?.role) === route.role)) {
    // unauthorized, go to login (or 403 page later)
    location.hash = '#/login';
    return;
  }
  route.render();
}

window.addEventListener("hashchange", resolve);
window.addEventListener("load", resolve);
