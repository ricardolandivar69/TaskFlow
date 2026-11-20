export const validStatuses = ['pending', 'in_progress', 'done'];
export const validPriorities = ['low', 'medium', 'high'];

const isObject = (value) => value !== null && typeof value === 'object' && !Array.isArray(value);
const normalizeEmail = (email) => typeof email === 'string' ? email.trim().toLowerCase() : '';

export function validateRegister(body) {
  if (!isObject(body)) return { error: 'Se requiere un cuerpo JSON valido.' };
  const name = typeof body.name === 'string' ? body.name.trim() : '';
  const email = normalizeEmail(body.email);
  const password = body.password;
  if (name.length < 2 || name.length > 70) return { error: 'El nombre debe tener entre 2 y 70 caracteres.' };
  if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email) || email.length > 254) return { error: 'Ingresa un correo electronico valido.' };
  if (typeof password !== 'string' || password.length < 8 || Buffer.byteLength(password, 'utf8') > 72) {
    return { error: 'La contrasena debe tener al menos 8 caracteres y maximo 72 bytes.' };
  }
  return { value: { name, email, password } };
}

export function validateLogin(body) {
  if (!isObject(body)) return { error: 'Se requiere un cuerpo JSON valido.' };
  const email = normalizeEmail(body.email);
  if (!email || typeof body.password !== 'string' || !body.password) return { error: 'Correo y contrasena obligatorios.' };
  return { value: { email, password: body.password } };
}

export function validateTask(body, { partial = false } = {}) {
  if (!isObject(body)) return { error: 'Se requiere un objeto JSON.' };
  const allowed = ['title', 'description', 'status', 'priority', 'dueDate'];
  const keys = Object.keys(body);
  if (keys.some((key) => !allowed.includes(key))) return { error: 'El cuerpo incluye campos no permitidos.' };
  if (partial && keys.length === 0) return { error: 'Envia al menos un campo para actualizar.' };
  const value = {};
  if (!partial || Object.hasOwn(body, 'title')) {
    const title = typeof body.title === 'string' ? body.title.trim() : '';
    if (title.length < 3 || title.length > 100) return { error: 'El titulo debe tener entre 3 y 100 caracteres.' };
    value.title = title;
  }
  if (Object.hasOwn(body, 'description')) {
    if (typeof body.description !== 'string' || body.description.length > 500) return { error: 'La descripcion no puede superar 500 caracteres.' };
    value.description = body.description.trim();
  }
  if (Object.hasOwn(body, 'status')) {
    if (!validStatuses.includes(body.status)) return { error: 'Estado no valido.' };
    value.status = body.status;
  }
  if (Object.hasOwn(body, 'priority')) {
    if (!validPriorities.includes(body.priority)) return { error: 'Prioridad no valida.' };
    value.priority = body.priority;
  }
  if (Object.hasOwn(body, 'dueDate')) {
    if (body.dueDate === null || body.dueDate === '') value.dueDate = null;
    else {
      if (typeof body.dueDate !== 'string' || !/^\d{4}-\d{2}-\d{2}$/.test(body.dueDate)) return { error: 'La fecha debe tener el formato AAAA-MM-DD.' };
      const d = new Date(`${body.dueDate}T12:00:00.000Z`);
      if (Number.isNaN(d.getTime()) || d.toISOString().slice(0, 10) !== body.dueDate) return { error: 'La fecha indicada no existe.' };
      value.dueDate = d;
    }
  }
  if (!partial && !Object.hasOwn(value, 'description')) value.description = '';
  if (!partial && !Object.hasOwn(value, 'status')) value.status = 'pending';
  if (!partial && !Object.hasOwn(value, 'priority')) value.priority = 'medium';
  return { value };
}
