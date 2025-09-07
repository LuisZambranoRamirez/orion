import connection from './mysql.js';
import { DataBaseError } from '../errors/dataBaseError.js';

export async function registerProductDB(name, price, stock, barCode, category) {
  try {

    const result = await connection.query(
      'INSERT INTO product (name, price, stock, barCode, category) VALUES (?, ?, ?, ?, ?)',
      [name, price, stock, barCode, category]
    );

    return result.affectedRows > 0;

  } catch (error) {
    throw new DataBaseError(error.code, error.errno, error.sqlMessage, error.sqlState, error.sql);
  }
}

export async function updateProductFieldDB(productoId, field, value) {
  const allowedFields = ['name', 'price', 'stock', 'category', 'barCode'];
  
  if (!allowedFields.includes(field)) return false;

  const [result] = await connection.query(`UPDATE product SET ${field} = ? WHERE productoId = ?`,
    [value, productoId]
  );

  return true;
}

export async function getProductDB(fieldId, valueId, columnsToConsult) {
    const allowedFields = ['name', 'barCode'];
    const allowColumns = ['productId', 'name', 'price', 'stock', 'category', 'barCode', 'registrarionDate'];

    if(!allowedFields.includes(fieldId)) return null;
    
    const uniqueCols = Array.from(new Set(columnsToConsult));
    
    for (const col of uniqueCols) {
        if (!allowColumns.includes(col)) return null;
    }

    const columnsQuery = uniqueCols.join(', ');

    const [result] = await connection.query(`SELECT ${columnsQuery} FROM product WHERE ${fieldId} = ? LIMIT 1`,
        [valueId]
    );

    return result[0];
}

export async function isProductBarCodeExistsDB(barCode) {
  const [result] = await connection.query(
    'SELECT barCode FROM product WHERE barCode = ?',
    [barCode]
  );

  return result.length > 0 && result[0].barCode === barCode;
}

export async function isProductNameExistsDB(name) {
  const [result] = await connection.query(
    'SELECT name FROM product WHERE name = ?',
    [name]
  );

  return result.length > 0 && result[0].name === name;
}
