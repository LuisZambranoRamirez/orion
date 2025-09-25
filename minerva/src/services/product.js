import { 
  validateProductBusinessRules, 
  validatePartialProductBusiness, 
  validateProductBarCode, 
  validateProductName, 
  categories, 
  saleModes 
} from '../schemas/product.js';

import { Result } from './Result.js';  
import { ProductRepository } from '../data/product.js';   // <-- usa tu repo

export class ProductService {

  static async updateExistingProduct(product) {
    const result = await validatePartialProductBusiness(product);

    if (!result.success) {
      return Result.failure(JSON.parse(result.error)[0].message);
    }

    const updateResult = await ProductRepository.updateProductByIdentifier(result.data);
    return !updateResult
      ? Result.failure('No se pudo actualizar el producto')
      : Result.success('Producto actualizado con éxito');
  }

  static async registerProduct(product) {
    const result = await validateProductBusinessRules(product);

    if (!result.success) {
      return Result.failure(JSON.parse(result.error)[0].message);
    }

    const { name, barCode } = result.data;  

    if (await ProductRepository.isProductNameExists(name)) {
      return Result.failure(`El producto -- ${name} -- ya está registrado`);
    }

    if (await ProductRepository.isProductBarCodeExists(barCode)) {
      return Result.failure(`El código de barras -- ${barCode} -- ya está registrado`);
    }

    const registerResult = await ProductRepository.registerProduct(result.data);

    return !registerResult
    ? Result.failure('No se pudo registrar el producto')
    : Result.success('Producto registrado con éxito');
  } 

  static async getMatchingProductByName(name) {
    const result = await validateProductName(name);

    if (!result.success) {
      return Result.failure(JSON.parse(result.error)[0].message);
    }

    const matchingProduct = await ProductRepository.getMatchingProductByName(name);

    return matchingProduct.length === 0
      ? Result.failure(`El producto -- ${name} -- no está registrado`)
      : Result.success(matchingProduct);
  }

  static async getProductByBarCode(barCode) {
    const result = await validateProductBarCode(barCode);

    if (!result.success) {
      return Result.failure(result.error);
    }

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
