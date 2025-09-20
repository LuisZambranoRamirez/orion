import connection from './mysql.js';
import { DataBaseError } from '../errors/dataBaseError.js';

export async function registerProductDB(name, gainAmount, stock, reorderLevel, barCode, saleMode, category) {
  try {

    await connection.query(
      'INSERT INTO product (productNameId, gainAmount, stock, reorderLevel, barCode, saleMode, category) VALUES (?, ?, ?, ?, ?, ?, ?)',
      [name, gainAmount, stock, reorderLevel, barCode, saleMode, category]
    );

  } catch (error) {
    throw new DataBaseError(error.code, error.errno, error.sqlMessage, error.sqlState, error.sql);
  }

  return await isProductNameExistsDB(name);
}

export async function updateProductFieldDB(productoId, field, value) {
  const allowedFields = ['name', 'price', 'stock', 'category', 'barCode'];
  
  if (!allowedFields.includes(field)) return false;

  const [result] = await connection.query(`UPDATE product SET ${field} = ? WHERE productoId = ?`,
    [value, productoId]
  );

  return true;
}

export async function getMatchingProductByName(name) {
  try {
    const pattern = `%${name}%`;
    const [rows] = await connection.query(
      'SELECT * FROM product WHERE productNameId LIKE ? LIMIT 3',
      [pattern]
    );
    return rows;
  } catch (error) {
    throw new DataBaseError(error.code, error.errno, error.sqlMessage, error.sqlState, error.sql);
  }
}

export async function getProductByBarCodeDB(barCode) {
  try {
    const [rows] = await connection.query(
      'SELECT * FROM product WHERE barCode = ?',
      [barCode]
    );
    return rows;
  } catch (error) {
    throw new DataBaseError(error.code, error.errno, error.sqlMessage, error.sqlState, error.sql);
  }
}

export async function getAllProductsDB() {
  try {
    const [rows] = await connection.query('SELECT * FROM product');
    return rows;
  } catch (error) {
    throw new DataBaseError(error.code, error.errno, error.sqlMessage, error.sqlState, error.sql);
  }
}

export async function isProductBarCodeExistsDB(barCode) {
  try {
    const [result] = await connection.query('SELECT barCode FROM product WHERE barCode = ?', [barCode]);
    return result.length > 0 && result[0].barCode === barCode;
  } catch (error) {
    throw new DataBaseError(error.code, error.errno, error.sqlMessage, error.sqlState, error.sql);
  }
}

export async function isProductNameExistsDB(name) {
  try {
    const [result] = await connection.query('SELECT productNameId FROM product WHERE productNameId = ?', [name]);
    return result.length > 0 && result[0].productNameId === name;
  } catch (error) {
    throw new DataBaseError(error.code, error.errno, error.sqlMessage, error.sqlState, error.sql);
  }
}
