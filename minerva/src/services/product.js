import { registerProductDB, isProductBarCodeExistsDB, isProductNameExistsDB, getAllProductsDB } from '../data/product.js';
import { validateProductSchemaBusinessRules, validatePartialProductBusinessSchema } from '../schemas/product.js';
import { categories } from '../schemas/product.js';
import { Result } from './Result.js'; 


export async function registerProduct(product) {
    // Reglas de negocio
    const resultBusinessRules = await validateProductSchemaBusinessRules(product);

    if (!resultBusinessRules.success) {
      return Result.failure(JSON.parse(resultBusinessRules.error)[0].message);
    }

    const { name, gainAmount, stock, barCode, saleMode, category } = resultBusinessRules.data;  

    if(await isProductNameExistsDB(name)) {
      return Result.failure(`El prodcuto -- ${name} -- ya esta registrado`);
    }

    if(await isProductBarCodeExistsDB(barCode)) {
      return Result.failure(`El codigo de barras -- ${barCode} -- ya esta registrado`);
    }
    await registerProductDB(name, gainAmount, stock, barCode, saleMode, category);
    return Result.success();
} 

export async function updateProductField(productoId, field, value) {
    
}

export async function getAllProducts() {
  return await getAllProductsDB();
}

export function getCategoriesProduct() {
  return categories;
}

/**
 * Buscar productos:
 * - Si viene barCode: busqueda exacta por codigo
 * - Si viene name: busqueda parcial por nombre
 * - Si ambos: prioriza barCode (asumiendo que barCode es más específico)
 */
export async function getProductsByFilter(result) {
  const resultBusinessRules = await validatePartialProductBusinessSchema(result);

  if (!resultBusinessRules.success) {
    throw new BusinessError(JSON.parse(resultBusinessRules.error)[0].message);
  }

  const { name, barCode } = resultBusinessRules.data;
  
  if (barCode) {
    // busqueda exacta por codigo
    const product = await getProductByBarCodeDB(barCode);
    // devolver array para consistencia con getAll
    return product ? [product] : [];
  }

  if (name) {
    return await getProductsByNameDB(name);
  }

  // si llegara aqui, es error de uso
  throw new BusinessError('Falta criterio de busqueda (name o barCode)');
}