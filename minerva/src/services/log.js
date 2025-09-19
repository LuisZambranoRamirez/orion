import { registerErrorInDB, registerConnectionLogInDB } from '../data/log.js';

export async function registerLogError(req, res, error) {
    const stack = error.stack || JSON.stringify(error);
    await registerErrorInDB(error.name, error.message, stack);
    return;
}

export async function registerLogConnection(ipAddress, httpMethod, endpoint, statusCode, responseTimeMs, responseSizeBytes, responseBody, requestBody) {
    await registerConnectionLogInDB(ipAddress, httpMethod, endpoint, statusCode, responseTimeMs, responseSizeBytes, responseBody, requestBody);
    return;
}