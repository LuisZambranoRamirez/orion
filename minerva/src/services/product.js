import { 
  categories, 
  saleModes 
} from '../schemas/product.js';

import { Result } from './Result.js';  
import { ProductRepository } from '../data/product.js';  
import { StockEntryRepository } from '../data/stockEntry.js';

export class ProductService {

  static async updateProduct(nameId, {gainAmount, stock, reorderLevel, barCode, saleMode, category}) {
    if (!(await ProductRepository.isProductNameRegistered(nameId))) {
      return Result.failure(`El producto -- ${nameId} -- no está registrado`);
    }

    if (barCode && await ProductRepository.isProductBarCodeRegistered(barCode)) {
      return Result.failure(`El código de barras -- ${barCode} -- ya está registrado`);
    }

    if (barCode && saleMode && saleMode === 'Granel') {
      return Result.failure('Los productos a granel no pueden tener código de barras');
    }
       
    const updateResult = await ProductRepository.updateProductByIdentifier(nameId, {gainAmount, stock, reorderLevel, barCode, saleMode, category});
    return updateResult
    ? Result.success('Producto actualizado con éxito')
    : Result.failure('No se pudo actualizar el producto');
  }

  static async registerProduct({name, gainAmount, reorderLevel, barCode, saleMode, category}) {
    if (await ProductRepository.isProductNameRegistered(name)) {
      return Result.failure(`El producto -- ${name} -- ya está registrado`);
    }

    if (barCode) {
      if (saleMode === 'Granel') {
        return Result.failure('Los productos a granel no pueden tener código de barras');
      }

      if (await ProductRepository.isProductBarCodeRegistered(barCode)) {
        return Result.failure(`El código de barras -- ${barCode} -- ya está registrado`);
      }      
    } else {
      if (saleMode === 'Unidad/Granel' || saleMode === 'Unidad') {
        return Result.failure('Los productos por unidad deben tener código de barras');
      }
    }
    
    const stock = 0;
    const registerResult = await ProductRepository.registerProduct({ name, gainAmount, stock, reorderLevel, barCode, saleMode, category });

    return registerResult
    ? Result.success('Producto registrado con éxito')
    : Result.failure('No se pudo registrar el producto');
  } 

  static async getListMatchingName(name) {
    const matchingProduct = await ProductRepository.getListMatchingName(name);

    return matchingProduct.length === 0
    ? Result.failure(`El producto -- ${name} -- no está registrado`)
    : Result.success(matchingProduct);
  }

  static async getProductByName(name) {
    const productByName = await ProductRepository.getProductByName(name);

    if (productByName.length === 0) {
      return Result.failure(`El producto -- ${name} -- no está registrado`);
    }

    const price = await this.calculatePrice(name, productByName.gainAmount);
    if (price !== -1) {
      productByName.price = price;
    }

    return Result.success(productByName);
  }

  static async getProductByBarCode(barCode) {
    const productByBarCode = await ProductRepository.getProductByBarCode(barCode);
    
    if (productByBarCode.length === 0) {
      return Result.failure(`El código -- ${barCode} -- no está registrado`);
    }

    const price = await this.calculatePrice(productByBarCode.productNameId, productByBarCode.gainAmount);
    if (price !== -1) {
      productByBarCode.price = price;
    }

    return Result.success(productByBarCode);
  }

  // ESTA FUNCION DEBE SER PRIVADA
  static async calculatePrice(productName, gainAmount) {
    const stockEntry = await StockEntryRepository.getFirstEntryOnLatestDate(productName);
    if (!stockEntry) return -1;
    
    return Number(stockEntry.priceUnit) + Number(gainAmount);
  }

  static async getAllProducts() {
    const listProducts = await ProductRepository.getAllProducts();
    for (let i = 0; i < listProducts.length; i++) {
      const price = await this.calculatePrice(listProducts[i].productNameId, listProducts[i].gainAmount);
      if (price !== -1) { 
        listProducts[i].price = price;
      }
    }
    return listProducts;
  }

  static getCategoriesProduct() {
    return categories;
  }

  static getSaleModesProduct() {
    return saleModes;
  }
}
