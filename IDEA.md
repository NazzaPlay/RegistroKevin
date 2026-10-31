# Simracing Academy Hub

## Descripción del Proyecto
Desarrollo y mantenimiento de una Single Page Application (SPA) autocontenida en un único archivo (`index.html`) alojada en GitHub Pages. Sirve como un portal de entrenamiento para pilotos de simracing (ej. Kevin y otros alumnos).

## Stack y Estilo Visual
- **Tecnologías:** HTML, CSS integrado (<style>) y Vanilla JS integrado (<script>). Sin frameworks ni dependencias externas.
- **UI/UX:** Estilo Apple Premium Glassmorphism. Modo oscuro (fondo `#0a0a0c`), tarjetas esmeriladas (`backdrop-filter: blur(16px)`), esquinas redondeadas y acentos de telemetría de alto contraste (neón azul, rojo, verde).

## Módulos Principales
1. **Biblioteca Teórica:** Módulos visuales sobre aerodinámica (LMP2, Le Mans, rebufo, aire sucio) usando diagramas vectoriales.
2. **Diario Emocional Multi-Alumno:** Formulario de registro de pista y niveles de ansiedad conectado a un backend gratuito. Utiliza `fetch` con `mode: 'no-cors'` y `URLSearchParams` para enviar los datos a una URL de Google Apps Script.
3. **Modo Clase en Vivo:** Vista slideshow panorámica 16:9 con navegación por teclado para compartir pantalla.
4. **Roadmap de Progresión:** Línea de tiempo visual de licencias.

## ⚠️ REGLA ESTRICTA DE FLUJO DE TRABAJO (GIT SYNC)
Actúas como un agente autónomo. Al finalizar **CUALQUIER** tarea de desarrollo, refactorización o corrección de bugs en este proyecto, tienes la obligación estricta de:
1. Ejecutar automáticamente `git add .`
2. Crear un commit con un mensaje descriptivo y profesional sobre los cambios realizados (`git commit -m "..."`).
3. Sincronizar inmediatamente los cambios con el repositorio remoto ejecutando `git push`, garantizando que la web en GitHub Pages se actualice en tiempo real. 
Nunca termines una tarea sin completar este flujo de Git.
