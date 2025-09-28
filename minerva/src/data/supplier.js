import connection from './mysql.js';
import { DataBaseError } from '../errors/dataBaseError.js';

export class SupplierRepository {
  static async  registerSupplier({name, ruc, phone}) {
    try {
      await connection.query('INSERT INTO supplier (supplierNameId, ruc, phone) VALUES (?, ?, ?)',[name, ruc, phone]);
    } catch (error) {
      throw new DataBaseError(error.code, error.errno, error.sqlMessage, error.sqlState, error.sql);
    }

    return await this.isSupplierRegistered(name);
  }

  static async isSupplierRegistered(supplierNameId) {
    try {
      const [rows] = await connection.query('SELECT supplierNameId FROM supplier WHERE supplierNameId = ?',[supplierNameId]);
      return rows.length > 0 && rows[0].supplierNameId === supplierNameId;
    } catch (error) {
      throw new DataBaseError(error.code, error.errno, error.sqlMessage, error.sqlState, error.sql);
    }
  }

  static async isSupplierRucExists(ruc) {
    try {
      const [rows] = await connection.query('SELECT ruc FROM supplier WHERE ruc = ?',[ruc]);
      return rows.length > 0 && rows[0].ruc === ruc;
    } catch (error) {
      throw new DataBaseError(error.code, error.errno, error.sqlMessage, error.sqlState, error.sql);
    }
  }

  static async isSupplierPhoneExists(phone) {
    try {
      const [rows] = await connection.query('SELECT phone FROM supplier WHERE phone = ?',[phone]);
      return rows.length > 0 && rows[0].phone === phone;
    } catch (error) {
      throw new DataBaseError(error.code, error.errno, error.sqlMessage, error.sqlState, error.sql);
    }
  }

  static async getAllSuppliers() {
    try {
      const [rows] = await connection.query('SELECT * FROM supplier');
      return rows;
    } catch (error) {
      throw new DataBaseError(error.code, error.errno, error.sqlMessage, error.sqlState, error.sql);
    }
  }

  static async getSupplierByIdentifier(supplierNameId) {
    try {
      const pattern = `%${supplierNameId}%`;
      const [rows] = await connection.query('SELECT * FROM supplier WHERE supplierNameId LIKE ? LIMIT 3',[pattern]);
      return rows;
    } catch (error) {
      throw new DataBaseError(error.code, error.errno, error.sqlMessage, error.sqlState, error.sql);
    }
  }

  static async updateSupplierByIdentifier(supplierNameId, {name, ruc, phone}) {
    let updateFields = [];
    let updateValues = [];

    if (name) {
      updateFields.push('supplierNameId = ?');
      updateValues.push(name);
    }
    if (ruc) {
      updateFields.push('ruc = ?');
      updateValues.push(ruc);
    }
    if (phone) {
      updateFields.push('phone = ?');
      updateValues.push(phone);
    }

    if (updateFields.length === 0) return false; 

    updateValues.push(supplierNameId);

    const updateQuery = `UPDATE supplier SET ${updateFields.join(', ')} WHERE supplierNameId = ?`;
    try {
      const [result] = await connection.query(updateQuery, updateValues);
      return result.affectedRows > 0;
    } catch (error) {
      throw new DataBaseError(error.code, error.errno, error.sqlMessage, error.sqlState, error.sql);
    }
  }
}