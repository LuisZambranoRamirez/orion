import { ProductService } from '../services/product.js';
import {  validateProductNameFormat } from '../schemas/product.js';

export async function updateProduct(req, res) {
  if (!req.body.name) {
    return res.status(422).json({ error: 'Se necesita el nombre del producto' });
  }

  const updateResult = await ProductService.updateExistingProduct(req.body);

  if (!updateResult.isSuccess) {
    return res.status(422).json({ error: updateResult.error });
  }

  return res.status(200).json({ message: 'Producto actualizado correctamente' });
};

export async function register(req, res) {
  const techResult = await validateProductNameFormat(req.body.name);

  if (!techResult.success) {
    return res.status(422).json({ error: JSON.parse(techResult.error)[0].message });
  }

  req.body.name = req.body.name.trim().replace(/\s+/g, ' ');

  const registerResult = await ProductService.registerProduct(req.body);

  if (!registerResult.isSuccess) {
    return res.status(422).json({ error: registerResult.error });
  }

  return res.status(201).json({ message: 'Producto registrado correctamente' });
};

export async function getByQuery(req, res) {
  const { name, barCode } = req.query;

  if (barCode) {
    const result = await ProductService.getProductByBarCode(barCode);

    if (!result.isSuccess) {
      return res.status(422).json({ error: result.error });
    }
    return res.status(200).json({ product: result.value });
  }

  if (name) {
    const result = await ProductService.getMatchingProductByName(name);

    if (!result.isSuccess) {
      return res.status(422).json({ error: result.error });
    }
    return res.status(200).json({ product: result.value });
  }

  return res.status(422).json({ error: 'Se necesita un identificador' });
}

export async function getAll(req, res) {
  return res.status(200).json({ products: await ProductService.getAllProducts() });
}

export async function getCategories(req, res) {
  return res.status(200).json({ categories: ProductService.getCategoriesProduct() });
}

export async function getSaleModes(req, res) {
  return res.status(200).json({ salesmodes: ProductService.getSaleModesProduct() });
}