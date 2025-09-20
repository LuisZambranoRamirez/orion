import connection from './mysql.js';
import { DataBaseError } from '../errors/dataBaseError.js';

export async function updateProductByIdentifierDB({ name, barCode, gainAmount, reorderLevel, saleMode, category, stock }) {
  try {
    const fields = [];
    const values = [];

    if (gainAmount !== undefined) {
      fields.push('gainAmount = ?');
      values.push(gainAmount);
    }

    if (stock !== undefined) {
      fields.push('stock = ?');
      values.push(stock);
    }

    if (reorderLevel !== undefined) {
      fields.push('reorderLevel = ?');
      values.push(reorderLevel);
    }

    if (saleMode !== undefined) {
      fields.push('saleMode = ?');
      values.push(saleMode);
    }

    if (category !== undefined) {
      fields.push('category = ?');
      values.push(category);
    }

    if (fields.length === 0) return false;

    const whereClause = [];
    if (name) {
      whereClause.push('productNameId = ?');
      values.push(name);
    }

    if (barCode) {
      whereClause.push('barCode = ?');
      values.push(barCode);
    }

    if (whereClause.length === 0 || fields.length === 0) return false;

    const query = `
      UPDATE product
      SET ${fields.join(', ')}
      WHERE ${whereClause.join(' OR ')}
    `;

    const [result] = await connection.query(query, values);

    return result.affectedRows > 0;
  } catch (error) {
    throw new DataBaseError(error.code, error.errno, error.sqlMessage, error.sqlState, error.sql);
  }
}


export async function registerProductDB({name, gainAmount, stock, reorderLevel, barCode, saleMode, category}) {
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


export async function getMatchingProductByNameDB(name) {
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
