export function errorHandler(err, req, res, next) {
    console.error(err.message); // logueas solo el mensaje, no la traza completa

  if (err instanceof SyntaxError && err.status === 400 && 'body' in err) {
    return res.status(400).json({ error: 'JSON inválido en el request' });
  }

  res.status(500).json({ error: 'Error interno del servidor' });
};