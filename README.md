# TaskFlow - Práctica Experimental 4 de Desarrollo Web

**TaskFlow** es una aplicación Full Stack para organizar actividades personales. Permite crear cuentas, iniciar sesión, acceder a un panel privado y gestionar tareas con estados, prioridades y fechas límite. Cada usuario únicamente puede consultar y modificar sus propios registros.

## Datos académicos

- **Universidad:** Universidad Estatal de Milagro (UNEMI)
- **Carrera:** Software, modalidad presencial
- **Asignatura:** Desarrollo Web, G004-S14
- **Práctica:** Trabajo Práctico Experimental 4
- **Docente de la práctica:** Msc. Mariana Madeleine Almache Sanisaca
- **Integrantes del grupo:**
  - Ricardo Landivar
  - Mariana Reyes
  - Carlos Llivisupa
  - Jackson Reyes
  - Miguel Peñafiel
- **Fecha informada por el grupo:** sábado 21 de noviembre de 2026, 23:59. **Importante:** la indicación anterior de la plataforma mencionaba jueves 19; comprobar la fecha vigente en el aula virtual.

## Tecnologías

- **Frontend:** React 19, Vite 6, CSS responsive
- **Backend:** Node.js 20+, Express, Mongoose
- **Base de datos:** MongoDB (local o MongoDB Atlas)
- **Seguridad:** bcryptjs para hash de contraseñas, JWT HS256 para rutas protegidas
- **Herramientas:** Visual Studio Code, MongoDB Compass, Postman, GitHub

## Funcionalidades

1. Registro de usuarios con validación de nombre, correo y contraseña.
2. Inicio de sesión con verificación de hash y emisión de JWT firmado con vencimiento.
3. Pantalla de perfil (`GET /api/auth/me`) protegida por JWT.
4. CRUD de tareas privadas (crear, consultar, actualizar, eliminar).
5. Filtros por estado y búsqueda de tareas desde React.
6. Prioridad baja/media/alta, estado pendiente/en progreso/completada y fecha opcional.
7. Control de propiedad: un usuario no puede leer ni modificar tareas de otro.
8. Persistencia MongoDB tras reiniciar el servidor.

## Requisitos previos

- **Node.js 20 o superior**, con NPM incluido (`node -v`, `npm -v`).
- MongoDB Community Server **en ejecución** o una cuenta MongoDB Atlas configurada.
- Windows PowerShell, Terminal o terminal integrada de VS Code.

## Instalación en Windows (PowerShell)

**1. Extraer ZIP y abrir la carpeta `TaskFlow` en Visual Studio Code.**

**2. MongoDB**. Instala MongoDB Community Server con el servicio habilitado y MongoDB Compass, o utiliza Atlas. En Compass, conecta a `mongodb://127.0.0.1:27017`. La base `taskflow_db` se creará cuando registres una cuenta. Si usas Atlas, pega tu URI privado en el `.env` del backend.

**3. Terminal del backend:**

```powershell
cd backend
Copy-Item .env.example .env
npm install
```

Abre `backend/.env` y edita `MONGODB_URI` si corresponde. Sustituye `JWT_SECRET` por un valor aleatorio y privado de **mínimo 32 caracteres**. Un ejemplo para generar un secreto en Node.js (ejecutar en terminal, no grabar el resultado):

```powershell
node -e "console.log(require('crypto').randomBytes(32).toString('hex'))"
```

Pega el valor obtenido después de `JWT_SECRET=` en `.env`. El archivo `.env` **no debe subirse a GitHub ni aparecer en capturas**.

Después ejecuta:

```powershell
npm run dev
```

El backend debe indicar `MongoDB conectado: taskflow_db` y `TaskFlow API: http://localhost:4000/api/health`. Comprueba esa URL en un navegador; debe responder `{"app":"TaskFlow","status":"ok"}`.

**4. Abre una segunda terminal en VS Code y ejecuta:**

```powershell
cd frontend
npm install
npm run dev
```

Entra a **http://localhost:5173**. Vite reenviará las peticiones `/api` al backend de puerto 4000. En el primer acceso crea una cuenta de ejemplo y luego inicia sesión.

**5. Registrar y probar tareas**. En el panel pulsa Nueva tarea, escribe un título, descripción, prioridad y fecha. Cambia el estado, edita y elimina. Si cierras el backend y lo vuelves a iniciar, tus registros persistirán en MongoDB.

**6. Pruebas técnicas** (otra terminal dentro de `backend`):

```powershell
npm test
```

La colección y el entorno de Postman están en `/postman`. Importa ambos. En el entorno configura los campos `passwordA` y `passwordB` localmente, usando contraseñas ficticias distintas de mínimo ocho caracteres. **Nunca exportes ni publiques un entorno con contraseñas o tokens reales.** Ejecuta las solicitudes numeradas en orden: los registros solo se realizan una vez por correo.

> **Sobre `package-lock.json`:** no está incluido en este ZIP de origen. Se genera con `npm install` en ambas carpetas. Antes de publicar en GitHub, incluye `backend/package-lock.json` y `frontend/package-lock.json` creados en tu computadora. No incluyas las carpetas `node_modules`.

## Endpoints (backend en puerto 4000)

| Método | Ruta | JWT | Descripción |
|---|---|---|---|
| GET | `/api/health` | No | Verificar conexión MongoDB |
| POST | `/api/auth/register` | No | Crear cuenta |
| POST | `/api/auth/login` | No | Iniciar sesión, obtener JWT |
| GET | `/api/auth/me` | Sí | Datos públicos de la cuenta autenticada |
| GET | `/api/tasks` | Sí | Listar tareas propias; filtro `?status=pending` |
| POST | `/api/tasks` | Sí | Crear tarea propia |
| GET | `/api/tasks/:id` | Sí | Consultar tarea propia |
| PUT | `/api/tasks/:id` | Sí | Editar parcialmente una tarea propia |
| DELETE | `/api/tasks/:id` | Sí | Eliminar tarea propia |

### Ejemplos de peticiones JSON

Registro `POST /api/auth/register`:

```json
{"name":"Usuario Ejemplo","email":"prueba@example.com","password":"UnaClaveFicticia123!"}
```

Login `POST /api/auth/login`:

```json
{"email":"prueba@example.com","password":"UnaClaveFicticia123!"}
```

Crear tarea `POST /api/tasks` (enviar encabezado `Authorization: Bearer <JWT>`):

```json
{"title":"Preparar informe","description":"Capturar pantalla en React y Compass","priority":"high","status":"pending","dueDate":"2026-11-21"}
```

Editar tarea `PUT /api/tasks/:id`:

```json
{"status":"done"}
```

### Errores esperados

- `400`: campos incorrectos, fecha no válida o identificador inválido.
- `401`: acceso sin token, token expirado o credenciales incorrectas.
- `404`: registro inexistente o perteneciente a otro usuario.
- `409`: registro con correo ya utilizado.

## Organización del proyecto

```text
TaskFlow/
  backend/
    src/config/          Conexión MongoDB
    src/models/          Colecciones User y Task
    src/controllers/     Registro, login y CRUD
    src/middleware/      Validación JWT y errores
    src/routes/          Rutas de Express
    src/utils/           Validaciones reutilizables
    tests/               Pruebas unitarias con node:test
    .env.example         Plantilla de variables (sin secretos)
    server.js            Inicialización del servidor
  frontend/
    src/components/      Formulario de tareas e iconos
    src/lib/api.js       Cliente HTTP fetch
    src/App.jsx          Login, registro y panel protegido
    src/styles.css       Estilos responsive
    vite.config.js       Proxy de desarrollo
  postman/                Colección y entorno de ejemplo
  docs/                   Guía de capturas y matriz de requisitos
```

## Seguridad y publicación

- Contraseñas protegidas con bcryptjs (no se devuelven hashes en las respuestas).
- Token JWT requerido en todos los endpoints de tareas.
- El usuario de cada tarea se obtiene del token y no se acepta un `owner` enviado por el cliente.
- En la demo académica el frontend guarda temporalmente el token en `sessionStorage`. Para producción conviene estudiar cookies HttpOnly, HTTPS y una estrategia de renovación de sesiones.
- El repositorio debe excluir `.env`, carpetas `node_modules`, datos personales, archivos `.log` y tokens JWT.
- La interfaz funciona localmente; **el despliegue en hosting no está incluido** y no es requisito explícito entre los entregables descritos en la guía.

## Entrega de la práctica

La guía solicita **un PDF con enlace al video demostrativo** (grabado desde computador, máximo 5 minutos, publicado en Drive con acceso de lectura) y **enlace al repositorio GitHub** con el código y el README. Verifica ambos enlaces en una ventana privada. Las capturas de pantalla ayudan a documentar el informe estudiantil; consulta `docs/GUIA_DE_CAPTURAS_Y_ENTREGA.md`.

**Estado del proyecto:** código fuente preparado, pruebas unitarias de validación ejecutadas. La integración real con MongoDB y la compilación de Vite requieren ejecutar `npm install` y levantar ambos servicios en una computadora con conexión a Internet. No presentar como probado end-to-end antes de realizar esas comprobaciones.
