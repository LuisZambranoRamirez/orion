import {registerLogConnection} from '../services/log.js'

/**
 * Solamente tiene en cuenta el tamaño del body rel response en bytes
 * 
 */
export function httpMonitorMiddleware(req, res, next) {
  const inicio = performance.now();
  const endpoint = req.url;
  const ipAddress = req.ip;
  const requestBody = req.body;
  const httpMethod = req.method;

  res.on('finish', async () => {
    const statusCode = res.statusCode;
    const responseTimeMs = (performance.now() - inicio).toFixed(3);
    const responseSizeBytes = res.get("Content-Length");
    const responseBody = res.sendData || {}; // Asumiendo que el body de la respuesta se guarda en res.sendData

    console.log(
      `${new Date().toLocaleTimeString()} | ` + // ← Aquí se agrega la hora
      `${httpMethod.padEnd(6)} ` +          // GET, POST, etc.
      `${String(statusCode).padEnd(6)}` +
      `| ${String(responseTimeMs).padEnd(8)} ms ` +
      `| ${String(responseSizeBytes).padEnd(4)} Bytes ` +
      `|  ip: ${ipAddress.padEnd(15)} ` +
      `|  ${endpoint} ` 
    );
   
    registerLogConnection(ipAddress, httpMethod, endpoint, statusCode, responseTimeMs, responseSizeBytes, responseBody, requestBody);
  });
  next();
}
