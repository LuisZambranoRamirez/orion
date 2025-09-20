import {registerProduct, getCategoriesProduct, getAllProducts, getSaleModesProduct, getProductByFilter} from '../services/product.js';
import { validateProductTechnicalRules } from '../schemas/product.js';
import {registerLogError} from '../services/log.js';

export async function register(req, res) {
  try {
    const techResult = await validateProductTechnicalRules(req.body);

    if (!techResult.success) {
      return res.status(422).json({ error: JSON.parse(techResult.error)[0].message });
    }

    let product = techResult.data;
    product.name = product.name.trim().replace(/\s+/g, ' ');

    const registrationResult = await registerProduct(product);

    if (!registrationResult.isSuccess) {
      return res.status(422).json({ error: registrationResult.error });
    }

    return res.status(201).json({ message: 'Producto registrado correctamente' });
  } catch (error) {
    registerLogError(req, res, error);
    return res.status(500).json({ error: 'Error interno del sersvidor'});
  }
};

/**
 * GET /search?name=...&barCode=...
 * - Si viene barCode => busca por codigo EXACTO
 * - Si viene name => busca por nombre (LIKE %name%)
 * - Si no vienen parametros => 400
 */
export async function getByQuery(req, res) {
  try {
    const result = await getProductByFilter(req.query);

    if (!result.isSuccess) {
      return res.status(422).json({ error: result.error });
    }

    return res.status(200).json({ product: result.value });
  } catch (error) {
    registerLogError(req, res, error);
    return res.status(500).json({ error: 'Error interno del sersvidor'});
  }
}

export async function getAll(req, res) {
  return res.status(200).json({ products: await getAllProducts()});
}

export async function getCategories(req, res) {
  return res.status(200).json({ categories:  getCategoriesProduct()});
}

export async function getSaleModes(req, res) {
  return res.status(200).json({ salesmodes:  getSaleModesProduct()});
}