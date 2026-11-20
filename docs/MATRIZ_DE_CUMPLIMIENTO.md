# Matriz de cumplimiento de la guía G004-S14 - Práctica Experimental 4

| Requisito | Implementación propuesta | Evidencia por obtener |
|---|---|---|
| MongoDB y colección usuarios | `backend/src/config/database.js` y `models/User.js` | Compass: `taskflow_db.users` |
| Node.js / Express / conexión MongoDB | `backend/server.js`, `src/app.js` | Terminal backend / `GET /api/health` |
| Registro y consulta de datos | `POST /api/auth/register`, `GET /api/auth/me`, rutas CRUD | Postman / frontend |
| Contraseñas seguras | `bcryptjs.hash()` y `bcryptjs.compare()` | Código; no mostrar contraseñas |
| Generación y validación JWT | `authController.js`, `middleware/requireAuth.js` | Login 200; sin token 401 |
| Al menos una ruta protegida | Todas las rutas `/api/tasks` y `GET /api/auth/me` | Sin token 401; con token 200 |
| React conectado a API | `frontend/src/lib/api.js`, `App.jsx`, proxy Vite | Pantallas React / terminal Vite |
| Registro e inicio desde React | `AuthPage` en `App.jsx` | Pantallas de registro y login |
| Comprobación de acceso autorizado/no | `GET /api/tasks` con/sin Bearer token; aislamiento A/B | Postman y React |
| Pruebas integrales | Colección de 22 peticiones + pruebas unitarias | Resultados obtenidos al ejecutar localmente |
| GitHub y README | `README.md`, `.gitignore`, carpeta del código | URL pública (pendiente) |
| Video <=5 minutos desde computador | Grabación con navegador, Compass, Postman | Drive con visualización (pendiente) |
| PDF con enlaces | Word estudiantil y exportación a PDF cuando estén las evidencias | Documento final (pendiente) |

Los puntos de evidencia **no se consideran probados** hasta ejecutarse realmente en la computadora del equipo.
