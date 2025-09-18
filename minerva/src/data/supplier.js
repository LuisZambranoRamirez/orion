import connection from './mysql.js';
import { DataBaseError } from '../errors/dataBaseError.js';

export async function registerSupplierDB(supplierNameId, ruc, phone) {
  try {

    await connection.query(
      'INSERT INTO supplier (supplierNameId, ruc, phone) VALUES (?, ?, ?)',
      [supplierNameId, ruc, phone]
    );

  } catch (error) {
    throw new DataBaseError(error.code, error.errno, error.sqlMessage, error.sqlState, error.sql);
  }

}
