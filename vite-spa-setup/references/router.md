# Router hash simple

Este archivo muestra la implementación mínima del router hash utilizada en la configuración VITE‑SPA‑SETUP.

```typescript
// src/router.ts
interface Route { path: string; render: () => void }
const routes: Route[] = []
export function register(path: string, render: () => void) {
  routes.push({ path, render })
}
function resolve() {
  const hash = location.hash.replace(/^#\/?/, '')
  const match = routes.find(r => r.path === hash)
  if (match) match.render()
}
window.addEventListener('hashchange', resolve)
window.addEventListener('load', resolve)
```

## Decisiones
- **Hash sencillo**: evita dependencias externas (no React Router, Vue Router, etc.).
- **Ruta vacía** (`''`) se usa como ruta por defecto; se fuerza con `location.hash = '#/dashboard'` en `main.ts`.
- **Sin ciclo de vida avanzado**: suficiente para paneles internos de la academia.

## Extensiones posibles
- Añadir soporte para parámetros (`#/curso/123`).
- Middleware para autorización antes de renderizar.
- Integrar con `history.pushState` para URLs limpias (requires server rewrite).
