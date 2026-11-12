export function renderDashboard() {
  const app = document.getElementById('app');
  if (!app) return;
  app.innerHTML = `
    <section class="dashboard">
      <h1>Panel de Administración</h1>
      <p>Bienvenido al backend de Patagonia Racing Academy.</p>
      <nav>
        <ul>
          <li><a href="#/students">Alumnos</a></li>
          <li><a href="#/cars">Coches</a></li>
          <li><a href="#/circuits">Circuitos</a></li>
        </ul>
      </nav>
    </section>`;
}
