import connection from '../data/mysql.js';
import crypto from 'node:crypto';

/**
 * Solamente tiene en cuenta el tamaño del body rel response en bytes
 * 
 */
export function httpMonitorMiddleware(req, res, next) {
  const connectionLogId = crypto.randomUUID();
  res.locals.connectionLogIdLocals = connectionLogId;
  const inicio = performance.now();
  const endpoint = req.url;

  res.on('finish', async () => {
    const ipAddress = req.ip;
    const httpMethod = req.method;
    const statusCode = res.statusCode;
    const responseTimeMs = (performance.now() - inicio).toFixed(3);
    const responseSizeBytes = res.get("Content-Length") || 0;
    const requestBody = JSON.stringify(req.body);
    const responseBody = JSON.stringify(res.body || {});
    const apiErrorId = res.locals.apiErrorId || null;

    console.log(`${httpMethod} ${endpoint} ${statusCode} - ${responseTimeMs} ms - ${responseSizeBytes} Bytes - ip: ${ipAddress} - logId: ${connectionLogId}`);
    
    try {
      await registerLogInDB(connectionLogId, ipAddress, httpMethod, endpoint, statusCode, responseTimeMs, responseSizeBytes, requestBody, responseBody, apiErrorId);
    } catch (error) {
      console.log(error);
      console.log('No se pudo registrar el log en la base de datos atentamente el middleware de registro de logs');
      console.log('Si llegaste hasta aqui, que DRAKO se apiade de nuestras almas');
    }
  });
  next();
}

export async function errorHandlingMiddleware(err, req, res, next) {
  if (!err) return next(); // No hay error, pasamos al siguiente middleware

  try {
    console.log('id  ' + res.locals.connectionLogIdLocals);
    await registerErrorInDB(err.name, err.message, err.stack, res.locals.connectionLogIdLocals);
  } catch (dbErr) {
    console.log(dbErr);
    console.log('No se pudo registrar el error en la base de datos atentamente el middleware de registro de errores');
    console.log('Si llegaste hasta aqui, que DRAKO se apiade de nuestras almas');
  }

  res.status(500).json({
    error: "Error interno del servidor",
  });
  next();
}

async function registerErrorInDB(typeError, errorMessage, stackTrace, connectionLogId) {
  await connection.query(
    'INSERT INTO apiErrors (typeError, errorMessage, stackTrace, connectionLogId) VALUES (?, ?, ?, ?)',
    [typeError, errorMessage, stackTrace, connectionLogId]
  );
}

async function registerLogInDB(connectionLogId, ipAddress, httpMethod, endpoint, statusCode, responseTimeMs, responseSizeBytes, responseBody, resqsuestBody) {
  await connection.query(
    'INSERT INTO connectionLogs(connectionLogId, ipAddress, httpMethod, endpoint, statusCode, responseTimeMs, responseSizeBytes, responseBody, requestBody)VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)',
    [
      connectionLogId,        // CHAR(36) UUID
      ipAddress,                 // ipAddress
      httpMethod,             // httpMethod (GET, POST...)
      endpoint,                // endpoint
      statusCode,         // statusCode
      responseTimeMs,         // responseTimeMs
      responseSizeBytes,      // responseSizeBytes
      JSON.stringify(responseBody),// responseBody
      JSON.stringify(resqsuestBody)// requestBody 
    ]
  );
}
