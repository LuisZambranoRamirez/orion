import connection from '../data/mysql.js';

/**
 * Solamente tiene en cuenta el tamaño del body rel response en bytes
 * 
 */
export function httpMonitorMiddleware(req, res, next) {
  const inicio = performance.now();
  const endpoint = req.url;
  const ipAddress = req.ip;
  const requestBody = req.body;

  res.on('finish', async () => {
    const httpMethod = req.method;
    const statusCode = res.statusCode;
    const responseTimeMs = (performance.now() - inicio).toFixed(3);
    const responseSizeBytes = res.get("Content-Length");
    const responseBody = res.sendData || {}; // Asumiendo que el body de la respuesta se guarda en res.sendData
    const apiErrorId = res.locals.apiErrorId || null;

    console.log(
      `${httpMethod.padEnd(8)} ` +       // GET, POST, etc.
      `${endpoint.padEnd(20)} ` +        // /, /api/users, etc.
      `${String(statusCode).padEnd(5)} - ` +
      `${String(responseTimeMs).padEnd(8)} ms - ` +
      `${String(responseSizeBytes).padEnd(8)} Bytes - ` +
      `ip: ${ipAddress.padEnd(15)} - ` +
      `apiErrorId: ${String(apiErrorId).padEnd(36)}`
    );
    
    try {
      await registerLogInDB(ipAddress, httpMethod, endpoint, statusCode, responseTimeMs, responseSizeBytes, responseBody, requestBody, apiErrorId);
    } catch (error) {
      console.log(error);
      console.log('No se pudo registrar el log en la base de datos atentamente el middleware de registro de logs');
      console.log('Si llegaste hasta aqui, que DRAKO se apiade de nuestras almas');
    }
  });
  next();
}

async function registerErrorInDB(typeError, errorMessage, stackTrace) {
  const [result] =  await connection.query(
    'INSERT INTO apiError (typeError, errorMessage, stackTrace) VALUES (?, ?, ?)',
    [typeError, errorMessage, stackTrace]
  );

  return result.insertId;
}

async function registerLogInDB(ipAddress, httpMethod, endpoint, statusCode, responseTimeMs, responseSizeBytes, responseBody, requestBody, apiErrorId) {
  await connection.query(
    'INSERT INTO connectionLog( ipAddress, httpMethod, endpoint, statusCode, responseTimeMs, responseSizeBytes, responseBody, requestBody, apiErrorId)VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)',
    [
      ipAddress,                 // ipAddress
      httpMethod,             // httpMethod (GET, POST...)
      endpoint,                // endpoint
      statusCode,         // statusCode
      responseTimeMs,         // responseTimeMs
      responseSizeBytes,      // responseSizeBytes
      JSON.stringify(responseBody),// responseBody
      JSON.stringify(requestBody),// requestBody 
      apiErrorId // apiErrorId (puede ser null)
    ]
  );
}
