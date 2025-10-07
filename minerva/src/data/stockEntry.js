import connection from "../data/mysql.js";
import { DataBaseError } from '../errors/dataBaseError.js';

export class StockEntryRepository {
    static async register({productName, supplierName, priceUnit, quantity}) {
        try {
            const query = 'INSERT INTO stockEntry (productNameId, supplierNameId, priceUnit, quantity) VALUES (?, ?, ?, ?)';
            const values = [productName, supplierName, priceUnit, quantity];

            const [rows] = await connection.query(query, values);
            return rows.insertId !== 0;
        } catch (error) {
            throw new DataBaseError(error.code, error.errno, error.sqlMessage, error.sqlState, error.sql);
        }
    }

    static async getAll() {
        try {
            const [rows] = await connection.query('SELECT * FROM stockentry ORDER BY registrationDate DESC');
            return rows;
        } catch (error) {
            throw new DataBaseError(error.code, error.errno, error.sqlMessage, error.sqlState, error.sql);
        }
    }

    static async getByProduct(productName) {
        try {
            const [rows] = await connection.query('SELECT * FROM stockentry WHERE productNameId = ? ORDER BY registrationDate DESC', [productName]);
            return rows;
        } catch (error) {
            throw new DataBaseError(error.code, error.errno, error.sqlMessage, error.sqlState, error.sql);
        }
    }

    static async getFirstEntryOnLatestDate(productName) {
        try {
            const [rows] = await connection.query(
                `
                WITH filtered AS (
                    SELECT *
                    FROM apolo.stockentry
                    WHERE productNameId = ?
                )
                SELECT *
                FROM filtered
                WHERE DATE(registrationDate) = (
                    SELECT DATE(registrationDate)
                    FROM filtered
                    ORDER BY registrationDate DESC
                    LIMIT 1
                )
                ORDER BY registrationDate ASC
                LIMIT 1;
                `,
                [productName]
            );
            return rows[0];
        } catch (error) {
            throw new DataBaseError(error.code, error.errno, error.sqlMessage, error.sqlState, error.sql);
        }
    }


    static async getBySupplier(supplierName) {
        try {
            const [rows] = await connection.query('SELECT * FROM stockentry WHERE supplierNameId = ? ORDER BY registrationDate DESC', [supplierName]);
            return rows;
        } catch (error) {
            throw new DataBaseError(error.code, error.errno, error.sqlMessage, error.sqlState, error.sql);
        }
    }
} 
