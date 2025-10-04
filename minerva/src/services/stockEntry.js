import { StockEntryRepository } from "../data/stockEntry.js";
import { ProductRepository } from "../data/product.js"; 
import { SupplierRepository } from "../data/supplier.js";
import { Result } from "./Result.js";

export class StockEntryService {
    static async register({productName, supplierName, priceUnit, quantity}) {
        if (!(await ProductRepository.isProductNameRegistered(productName))) {
            return Result.failure(`El producto -- ${productName} -- no está registrado`);
        }

        if (!(await SupplierRepository.isSupplierRegistered(supplierName))) {
            return Result.failure(`El proveedor -- ${supplierName} -- no está registrado`);
        }

        const resultRegister = await StockEntryRepository.register({productName, supplierName, priceUnit, quantity});
        
        return resultRegister
        ? Result.success("Entrada de stock registrada exitosamente")
        : Result.failure("No se pudo registrar la entrada de stock");
    }

    static async getAll() {
        const stockEntries = await StockEntryRepository.getAll();
        return Result.success(stockEntries);
    }

    static async getByProduct(productName) {
        const stockEntries = await StockEntryRepository.getByProduct(productName);
        return Result.success(stockEntries);
    }

    static async getBySupplier(supplierName) {
        const stockEntries = await StockEntryRepository.getBySupplier(supplierName);
        return Result.success(stockEntries);
    }
}