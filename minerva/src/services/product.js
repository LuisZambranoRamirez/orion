import { registerProductDB, isProductBarCodeExistsDB, isProductNameExistsDB, getAllProductsDB, getMatchingProductByName, getProductByBarCodeDB } from '../data/product.js';
import { validateProductBusinessRules, validatePartialProductBusiness, categories, saleModes } from '../schemas/product.js';
import { Result } from './Result.js'; 


export async function registerProduct(product) {
    // Reglas de negocio
    const result = await validateProductBusinessRules(product);

    if (!result.success) {
      return Result.failure(JSON.parse(result.error)[0].message);
    }

    const { name, gainAmount, reorderLevel, barCode, saleMode, category } = result.data;  

    if(await isProductNameExistsDB(name)) {
      return Result.failure(`El prodcuto -- ${name} -- ya esta registrado`);
    }

    if(await isProductBarCodeExistsDB(barCode)) {
      return Result.failure(`El codigo de barras -- ${barCode} -- ya esta registrado`);
    }

    await registerProductDB(name, gainAmount, 0, reorderLevel, barCode, saleMode, category);
    return Result.success('');
} 

export async function getProductByFilter(prodcut) {
  const result = await validatePartialProductBusiness(prodcut);

  if (!result.success) {
    return Result.failure(JSON.parse(result.error)[0].message);
  }
  
  const {name, barCode} = result.data;

  if (barCode) {
    const productByBarCode = await getProductByBarCodeDB(barCode);
    return productByBarCode.length === 0
      ? Result.failure(`El código -- ${barCode} no está registrado`)
      : Result.success(productByBarCode);
  }

  if (name) {
    const matchingProduct = await getMatchingProductByName(name);
    return matchingProduct.length === 0
      ? Result.failure(`El producto -- ${name} -- no está registrado`)
      : Result.success(matchingProduct);
  }

  return Result.failure('Invalid input: Se necesita un identificador (nombre o codigo de barras)')
}

export async function updateProductField(productoId, field, value) {
    
}

export async function getAllProducts() {
  return await getAllProductsDB();
}

export function getCategoriesProduct() {
  return categories;
}

export function getSaleModesProduct() {
  return saleModes;
}
