/**
 * Solamente tiene en cuenta el tamaño del body rel response en bytes
 * 
 */
export function httpMonitorMiddleware(req, res, next) {
  const inicio = performance.now();

  res.on('finish', () => {
    console.log(
      `${req.method} ${req.url} ${res.statusCode} - ${(performance.now() - inicio).toFixed(3)} ms - ${res.get("Content-Length") || 0} Bytes`
    );
  });
  next();
}