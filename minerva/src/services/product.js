import { registerProductDB, isProductBarCodeExistsDB, isProductNameExistsDB, getAllProductsDB, getMatchingProductByNameDB, getProductByBarCodeDB, updateProductByIdentifierDB } from '../data/product.js';
import { validateProductBusinessRules, validatePartialProductBusiness, validateProductBarCode, validateProductName, categories, saleModes } from '../schemas/product.js';
import { Result } from './Result.js';  

export async function updateExistingProduct(product) {
  const result = await validatePartialProductBusiness(product);

  if (!result.success) {
    return Result.failure(JSON.parse(result.error)[0].message);
  }

  await updateProductByIdentifierDB(result.data);

  return Result.success('');
}

export async function registerProduct(product) {
  const result = await validateProductBusinessRules(product);

  if (!result.success) {
    return Result.failure(JSON.parse(result.error)[0].message);
  }

  const { name, barCode } = result.data;  

  if(await isProductNameExistsDB(name)) {
    return Result.failure(`El prodcuto -- ${name} -- ya esta registrado`);
  }

  if(await isProductBarCodeExistsDB(barCode)) {
    return Result.failure(`El codigo de barras -- ${barCode} -- ya esta registrado`);
  }

  await registerProductDB(result.data);
  return Result.success('');
} 

export async function getMatchingProductByName(name) {
  const result = await validateProductName(name);
  console.log(result)
  if (!result.success) {
    return Result.failure(JSON.parse(result.error)[0].message);
  }

  const matchingProduct = await getMatchingProductByNameDB(name);

  return matchingProduct.length === 0
    ? Result.failure(`El producto -- ${name} -- no está registrado`)
    : Result.success(matchingProduct);
}

export async function getProductByBarCode(barCode) {
  const result = await validateProductBarCode(barCode);

  if (!result.success) {
    return Result.failure(result.error);
  }

  const productByBarCode = await getProductByBarCodeDB(barCode);
  
  return productByBarCode.length === 0
    ? Result.failure(`El código -- ${barCode} -- no está registrado`)
    : Result.success(productByBarCode);
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
