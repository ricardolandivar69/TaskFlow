const baseURL = (import.meta.env.VITE_API_BASE_URL || '/api').replace(/\/$/, '');

export async function api(path, { method = 'GET', token = '', body } = {}) {
  const headers = { Accept: 'application/json' };
  if (token) headers.Authorization = `Bearer ${token}`;
  if (body !== undefined) headers['Content-Type'] = 'application/json';

  let response;
  try {
    response = await fetch(`${baseURL}${path}`, {
      method,
      headers,
      body: body === undefined ? undefined : JSON.stringify(body)
    });
  } catch {
    throw new Error('No se pudo conectar con la API. Revisa MongoDB y el backend.');
  }

  const payload = await response.json().catch(() => ({}));
  if (!response.ok) {
    const error = new Error(payload.message || `Error HTTP ${response.status}`);
    error.status = response.status;
    throw error;
  }
  return payload;
}
