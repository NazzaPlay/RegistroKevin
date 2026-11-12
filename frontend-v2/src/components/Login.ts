// src/components/Login.ts
// Formulario de login simple. Tras éxito guarda el usuario en estado global y redirige a la ruta protegida.

import { apiRequest } from '../services/api/client';
import { setUser } from '../state/auth';
import { register } from '../router';

function renderLogin() {
  const app = document.getElementById('app');
  if (!app) return;
  app.innerHTML = `
    <section class="login">
      <h1>Acceso</h1>
      <form id="login-form">
        <label>Email <input type="email" name="email" required /></label>
        <label>Contraseña <input type="password" name="password" required minlength="8" /></label>
        <button type="submit">Entrar</button>
      </form>
      <p id="login-error" class="error" style="display:none;"></p>
    </section>`;

  const form = document.getElementById('login-form') as HTMLFormElement;
  form.addEventListener('submit', async (e) => {
    e.preventDefault();
    const fd = new FormData(form);
    try {
      const data = await apiRequest('/auth/login', {
        method: 'POST',
        body: {
          email: fd.get('email') as string,
          password: fd.get('password') as string,
        },
      });
      setUser(data.user);
      // Redirigir a dashboard protegido
      location.hash = '#/dashboard';
    } catch (err) {
      const errEl = document.getElementById('login-error') as HTMLElement;
      errEl.textContent = (err as Error).message;
      errEl.style.display = 'block';
    }
  });
}

// Registrar ruta de login (pública)
register('login', renderLogin);
export { renderLogin };
