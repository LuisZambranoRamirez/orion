import connection from './mysql.js';
import { DataBaseError } from '../errors/dataBaseError.js';

export async function registerProductDB(name, gainAmount, stock, barCode, saleMode, category) {
  try {

    await connection.query(
      'INSERT INTO product (productNameId, gainAmount, stock, barCode, saleMode, category) VALUES (?, ?, ?, ?, ?, ?)',
      [name, gainAmount, stock, barCode, saleMode, category]
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

/**
 * Búsqueda parcial por nombre (LIKE)
 * devuelve array de productos que coincidan parcialmente con name
 */
export async function getProductsByNameDB(name) {
  try {
    const pattern = `%${name}%`;
    const [rows] = await connection.query(
      'SELECT * FROM product WHERE name LIKE ?',
      [pattern]
    );
    return rows;
  } catch (error) {
    throw new DataBaseError(error.code, error.errno, error.sqlMessage, error.sqlState, error.sql);
  }
}

/**
 * Búsqueda exacta por codigo de barras
 * devuelve un objeto producto o null
 */
export async function getProductByBarCodeDB(barCode) {
  try {
    const [rows] = await connection.query(
      'SELECT * FROM product WHERE barCode = ?',
      [barCode]
    );
    return rows.length > 0 ? rows[0] : null;
  } catch (error) {
    throw new DataBaseError(error.code, error.errno, error.sqlMessage, error.sqlState, error.sql);
  }
}

export async function getAllProductsDB() {
  try {
    return await connection.query('SELECT * FROM product');
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
    const [result] = await connection.query('SELECT productNameId FROM product WHERE name = ?', [name]);
    return result.length > 0 && result[0].name === name;
  } catch (error) {
    throw new DataBaseError(error.code, error.errno, error.sqlMessage, error.sqlState, error.sql);
  }
}
