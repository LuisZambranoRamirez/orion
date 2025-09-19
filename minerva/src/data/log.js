import connection from './mysql.js';


export async function registerErrorInDB(typeError, errorMessage, stackTrace) {
  try {
    const [result] =  await connection.query(
        'INSERT INTO apiError (typeError, errorMessage, stackTrace) VALUES (?, ?, ?)',
        [typeError, errorMessage, stackTrace]
    );

    return result.insertId;
  } catch (error) {
    console.log("ERROR AL REGISTRAR EL ERROR EN LA TABLA API ERROR");
    console.log(error);
  }
}

export async function registerConnectionLogInDB(ipAddress, httpMethod, endpoint, statusCode, responseTimeMs, responseSizeBytes, responseBody, requestBody) {
  try {
    await connection.query(
        'INSERT INTO connectionLog( ipAddress, httpMethod, endpoint, statusCode, responseTimeMs, responseSizeBytes, responseBody, requestBody)VALUES (?, ?, ?, ?, ?, ?, ?, ?)',
        [
        ipAddress,                 // ipAddress
        httpMethod,             // httpMethod (GET, POST...)
        endpoint,                // endpoint
        statusCode,         // statusCode
        responseTimeMs,         // responseTimeMs
        responseSizeBytes,      // responseSizeBytes
        JSON.stringify(responseBody),// responseBody
        JSON.stringify(requestBody)// requestBody 
        ]
    );
  } catch (error) {
    console.log("ERROR AL REGISTRAR EL LOG EN LA TABLA CONNECTION LOG");
    console.log(error);
  }
}
