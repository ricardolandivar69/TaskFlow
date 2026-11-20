import test from 'node:test';
import assert from 'node:assert/strict';
import { validateRegister, validateLogin, validateTask } from '../src/utils/validation.js';

test('registro valido normaliza correo y nombre', () => {
  const result = validateRegister({ name: '  Ana  ', email: ' ANA@EJEMPLO.COM ', password: 'Seguro1234!' });
  assert.deepEqual(result.value, { name: 'Ana', email: 'ana@ejemplo.com', password: 'Seguro1234!' });
});
test('registro rechaza contrasena corta', () => {
  assert.ok(validateRegister({ name: 'Ana', email: 'a@b.com', password: '123' }).error);
});
test('registro rechaza correo incorrecto', () => {
  assert.ok(validateRegister({ name: 'Ana', email: 'no-correo', password: 'Seguro1234!' }).error);
});
test('login necesita correo y contrasena', () => {
  assert.ok(validateLogin({ email: 'ana@ejemplo.com' }).error);
});
test('tarea valida establece valores por defecto', () => {
  const result = validateTask({ title: '  Preparar informe  ' });
  assert.equal(result.value.title, 'Preparar informe');
  assert.equal(result.value.status, 'pending');
  assert.equal(result.value.priority, 'medium');
});
test('tarea rechaza estado desconocido', () => {
  assert.ok(validateTask({ title: 'Preparar informe', status: 'other' }).error);
});
test('tarea rechaza fecha imposible', () => {
  assert.ok(validateTask({ title: 'Preparar informe', dueDate: '2026-02-30' }).error);
});
test('tarea rechaza propietario enviado por cliente', () => {
  assert.ok(validateTask({ title: 'Preparar informe', owner: 'otro_usuario' }).error);
});
test('actualizacion parcial solo cambia campos recibidos', () => {
  const result = validateTask({ status: 'done' }, { partial: true });
  assert.deepEqual(result.value, { status: 'done' });
});
test('actualizacion sin campos se rechaza', () => {
  assert.ok(validateTask({}, { partial: true }).error);
});
