import connection from './mysql.js';
import { DataBaseError } from '../errors/dataBaseError.js';

export class ProductRepository {
  static async updateProductByIdentifier({ name, barCode, gainAmount, reorderLevel, saleMode, category, stock }) {
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

      if (barCode !== undefined) {
        fields.push('barCode = ?');
        values.push(barCode);
      }

      if (fields.length === 0) return false;

      if (name !== undefined) {
        values.push(name);
      }

      const query = `UPDATE product SET ${fields.join(', ')} WHERE productNameId = ?`;
      const [result] = await connection.query(query, values);

      return result.affectedRows > 0;
    } catch (error) {
      throw new DataBaseError(error.code, error.errno, error.sqlMessage, error.sqlState, error.sql);
    }
  }

  static async registerProduct({ name, gainAmount, stock, reorderLevel, barCode, saleMode, category }) {
    try {
      await connection.query(
        'INSERT INTO product (productNameId, gainAmount, stock, reorderLevel, barCode, saleMode, category) VALUES (?, ?, ?, ?, ?, ?, ?)',
        [name, gainAmount, stock, reorderLevel, barCode, saleMode, category]
      );
    } catch (error) {
      throw new DataBaseError(error.code, error.errno, error.sqlMessage, error.sqlState, error.sql);
    }

    return await this.isProductNameExists(name);
  }


  static async getMatchingProductByName(name) {
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

  static async getProductByBarCode(barCode) {
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

  static async getAllProducts() {
    try {
      const [rows] = await connection.query('SELECT * FROM product');
      return rows;
    } catch (error) {
      throw new DataBaseError(error.code, error.errno, error.sqlMessage, error.sqlState, error.sql);
    }
  }


  static async isProductBarCodeExists(barCode) {
    try {
      const [result] = await connection.query('SELECT barCode FROM product WHERE barCode = ?', [barCode]);
      return result.length > 0 && result[0].barCode === barCode;
    } catch (error) {
      throw new DataBaseError(error.code, error.errno, error.sqlMessage, error.sqlState, error.sql);
    }
  }


  static async isProductNameExists(name) {
    try {
      const [result] = await connection.query('SELECT productNameId FROM product WHERE productNameId = ?', [name]);
      return result.length > 0 && result[0].productNameId === name;
    } catch (error) {
      throw new DataBaseError(error.code, error.errno, error.sqlMessage, error.sqlState, error.sql);
    }
  }
  
}
