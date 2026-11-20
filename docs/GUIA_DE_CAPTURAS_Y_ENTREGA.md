# TaskFlow | Guía de capturas para la documentación estudiantil de UNEMI

**Docente de la práctica:** Msc. Mariana Madeleine Almache Sanisaca  
**Grupo:** Ricardo Landivar, Mariana Reyes, Carlos Llivisupa, Jackson Reyes y Miguel Peñafiel.

## Capturas recomendadas (en este orden)

1. **E01 - Estructura en VS Code:** árbol `frontend`, `backend`, `postman`, `docs`; abre el `README.md` al lado.
2. **E02 - Conexión backend:** terminal `npm run dev` mostrando `MongoDB conectado` y servidor `http://localhost:4000`. No mostrar `.env` ni secretos.
3. **E03 - MongoDB Compass:** base `taskflow_db`, colección `users` y `tasks`. Si vas a fotografiar registros, captura `tasks`; evita mostrar `passwordHash` de usuarios.
4. **E04 - Registro en React:** pantalla Registrarse con nombre y correo ficticios; evita capturar contraseñas.
5. **E05 - Inicio de sesión en React:** pantalla Iniciar sesión, solo campos y enlace local, sin revelar contraseñas.
6. **E06 - Panel privado:** pantalla con usuario autenticado y al menos dos o tres tareas con diferentes estados.
7. **E07 - Creación de tarea:** formulario Nueva tarea con título, prioridad, fecha; puedes capturar antes de guardar y después el listado creado.
8. **E08 - Actualización y eliminación:** antes/después de una tarea editada o de un cambio de estado; registro eliminado y listado actualizado.
9. **E09 - Seguridad JWT en Postman:** `GET /api/tasks` sin Authorization responde `401`. Importante: no fotografiar el JWT válido completo.
10. **E10 - Datos protegidos:** Postman `GET /api/tasks` con JWT responde `200` (oculta el valor del encabezado Authorization). Opcional: demostrar usuario B no ve tareas de A (`404`).
11. **E11 - Persistencia:** con 2 tareas creadas, reinicia Node.js y muestra que siguen en React o MongoDB Compass.
12. **E12 - GitHub:** captura del repositorio publicado con `README.md`, `frontend/` y `backend/` visibles. Añadir URL verificada.

## Qué debe contener el documento final

- Portada en **plantilla estudiantil original de UNEMI**, sin rediseñar encabezado/logo.
- Asignatura, tema, práctica 4, docente **Msc. Mariana Madeleine Almache Sanisaca**, nombres de los cinco integrantes uno debajo del otro.
- Introducción, objetivo, herramientas, arquitectura, pasos realizados, pruebas y conclusiones breves.
- Capturas **centradas**, con títulos y textos cortos; sin sangría de párrafo.
- Tablas con bordes negros y texto centrado horizontal y verticalmente.
- Enlace de **GitHub** público con el código funcional y README.
- Enlace de **Google Drive** al video demostrativo grabado en computadora de hasta **5 minutos**.
- Exportar el Word final también a **PDF**, porque **el archivo de entrega solicitado por la guía es PDF**.

## Atención a la fecha límite

El grupo informa **sábado 21 de noviembre de 2026, 23:59**. En un mensaje anterior la plataforma mostraba **jueves 19 de noviembre de 2026, 23:59**. Confirmar en el aula virtual cuál es la fecha vigente antes de confiar en una ampliación.

**Las capturas son útiles para el formato estudiantil pero la guía expresa que lo indispensable en el PDF son los enlaces al repositorio y al video.**
