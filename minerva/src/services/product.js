import { 
  categories, 
  saleModes 
} from '../schemas/product.js';

import { Result } from './Result.js';  
import { ProductRepository } from '../data/product.js';  

export class ProductService {

  static async updateProduct(nameId, {name, gainAmount, stock, reorderLevel, barCode, saleMode, category}) {
    nameId = nameId.trim().replace(/\s+/g, ' ').toLowerCase();

    if (!(await ProductRepository.isProductNameExists(nameId))) {
      return Result.failure(`El producto -- ${nameId} -- no está registrado`);
    }

    if (name) {
      name = name.trim().replace(/\s+/g, ' ').toLowerCase();
      if (await ProductRepository.isProductNameExists(name)) {
        return Result.failure(`El producto -- ${name} -- ya está registrado`);
      }
    }

    if (barCode && await ProductRepository.isProductBarCodeExists(barCode)) {
      return Result.failure(`El código de barras -- ${barCode} -- ya está registrado`);
    }
       
    const updateResult = await ProductRepository.updateProductByIdentifier(nameId, {name, gainAmount, stock, reorderLevel, barCode, saleMode, category});
    return updateResult
    ? Result.success('Producto actualizado con éxito')
    : Result.failure('No se pudo actualizar el producto');
  }

  static async registerProduct({name, gainAmount, stock, reorderLevel, barCode, saleMode, category}) {
    name = name.trim().replace(/\s+/g, ' ').toLowerCase();

    if (await ProductRepository.isProductNameExists(name)) {
      return Result.failure(`El producto -- ${name} -- ya está registrado`);
    }

    if (barCode && await ProductRepository.isProductBarCodeExists(barCode)) {
      return Result.failure(`El código de barras -- ${barCode} -- ya está registrado`);
    }

    const registerResult = await ProductRepository.registerProduct({ name, gainAmount, stock, reorderLevel, barCode, saleMode, category });

    return registerResult
    ? Result.success('Producto registrado con éxito')
    : Result.failure('No se pudo registrar el producto');
  } 

  static async getMatchingProductByName(name) {
    name = name.trim().replace(/\s+/g, ' ').toLowerCase();
    const matchingProduct = await ProductRepository.getMatchingProductByName(name);

    return matchingProduct.length === 0
    ? Result.failure(`El producto -- ${name} -- no está registrado`)
    : Result.success(matchingProduct);
  }

  static async getProductByBarCode(barCode) {
    const productByBarCode = await ProductRepository.getProductByBarCode(barCode);
    
    return productByBarCode.length === 0
    ? Result.failure(`El código -- ${barCode} -- no está registrado`)
    : Result.success(productByBarCode);
  }

  static async getAllProducts() {
    return await ProductRepository.getAllProducts();
  }

  static getCategoriesProduct() {
    return categories;
  }

  static getSaleModesProduct() {
    return saleModes;
  }
}
