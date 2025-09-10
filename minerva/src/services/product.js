import {registerProductDB, isProductBarCodeExistsDB, isProductNameExistsDB, getAllProductsDB} from '../data/product.js';
import { BusinessError } from '../errors/businessError.js';
import { validateProductSchemaBusinessRules } from '../schemas/product.js';
import { categories } from '../schemas/enums.js';

export async function registerProduct(result) {
    // Reglas de negocio
    const resultBusinessRules = await validateProductSchemaBusinessRules(result);

    if (!resultBusinessRules.success) {
        throw new BusinessError(JSON.parse(resultBusinessRules.error)[0].message);
    }

    const { name, price, stock, barCode, category } = resultBusinessRules.data;  

    if(await isProductNameExistsDB(name)) {
        throw new BusinessError(`El prodcuto -- ${name} -- ya esta registrado`);
    }

    if(await isProductBarCodeExistsDB(barCode)) {
        throw new BusinessError(`El codigo de barras -- ${barCode} -- ya esta registrado`);
    }
    
    return await registerProductDB(name, price, stock, barCode, category);
} 

export async function updateProductField(productoId, field, value) {
    
}

export async function getAllProducts() {
    return await getAllProductsDB();
}

export function getCategoriesProduct() {
  return categories;
}

