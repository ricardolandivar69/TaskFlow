export function notFound(req, res) {
  return res.status(404).json({ message: 'Ruta no encontrada.' });
}

export function errorHandler(err, req, res, next) {
  if (res.headersSent) return next(err);
  if (err?.code === 11000) return res.status(409).json({ message: 'Ya existe una cuenta con ese correo.' });
  if (err?.name === 'ValidationError' || err?.name === 'CastError') return res.status(400).json({ message: 'Los datos enviados no son validos.' });
  if (err?.type === 'entity.parse.failed') return res.status(400).json({ message: 'JSON mal formado.' });
  console.error('[TaskFlow] Error interno:', err?.message || err);
  return res.status(500).json({ message: 'Ocurrio un error interno. Intenta nuevamente.' });
}
