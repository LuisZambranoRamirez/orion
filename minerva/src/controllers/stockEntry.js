import { StockEntryService } from "../services/stockEntry.js";
import { validateStockEntryBusinessRules } from "../schemas/stockEntry.js";
import { validateProductName } from "../schemas/product.js";
import { validateSupplierName } from "../schemas/supplier.js";

export class StockEntryController {
    static async register(req, res) {
        const stockEntryResult = await validateStockEntryBusinessRules(req.body);

        if (!stockEntryResult.success) {
            return res.status(422).json({error: JSON.parse(stockEntryResult.error)[0].message});
        }    

        const registerResult = await StockEntryService.register(stockEntryResult.data);

        return registerResult.isSuccess
        ? res.status(201).json({ message: registerResult.value })
        : res.status(422).json({ error: registerResult.error });
    }

    static async getAll(req, res) {
        const getAllResult = await StockEntryService.getAll();

        return getAllResult.isSuccess
        ? res.status(200).json({ stockEntries: getAllResult.value })
        : res.status(422).json({ error: getAllResult.error });
    }

    static async getByProduct(req, res) {
        const productNameResult = await validateProductName(req.query.productName);

        if (!productNameResult.success) {
            return res.status(422).json({error: JSON.parse(productNameResult.error)[0].message});
        }

        const getByProductResult = await StockEntryService.getByProduct(productNameResult.data);

        return getByProductResult.isSuccess
        ? res.status(200).json({ stockEntries: getByProductResult.value })
        : res.status(422).json({ error: getByProductResult.error });
    }

    static async getBySupplier(req, res) {
        const supplierNameResult = await validateSupplierName(req.query.supplierName);

        if (!supplierNameResult.success) {
            return res.status(422).json({error: JSON.parse(supplierNameResult.error)[0].message});
        }

        const getBySupplierResult = await StockEntryService.getBySupplier(supplierNameResult.data);

        return getBySupplierResult.isSuccess
        ? res.status(200).json({ stockEntries: getBySupplierResult.value })
        : res.status(422).json({ error: getBySupplierResult.error });
    }
}