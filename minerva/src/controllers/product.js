import {registerProduct, getCategoriesProduct, getAllProducts, getSaleModesProduct, getMatchingProductByName, updateExistingProduct, getProductByBarCode} from '../services/product.js';
import {  validateProductNameFormat } from '../schemas/product.js';
import {registerLogError} from '../services/log.js';

export async function updateProduct(req, res) {
  try {
    const techResult = await validatePartialProductTechnicalRules(req.body);

    if (!techResult.success) {
      return res.status(422).json({ error: JSON.parse(techResult.error)[0].message });
    }

    let product = techResult.data;

    if (product.name) {
      product.name = product.name.trim().replace(/\s+/g, ' ');
    }

    const updateResult = await updateExistingProduct(product);

    if (!updateResult.isSuccess) {
      return res.status(422).json({ error: updateResult.error });
    }

    return res.status(200).json({ message: 'Producto actualizado correctamente' });
  } catch (error) {
    registerLogError(req, res, error);
    return res.status(500).json({ error: 'Error interno del servidor' });
  }
}

export async function register(req, res) {
  try {
    const techResult = await validateProductNameFormat(req.body);

    if (!techResult.success) {
      return res.status(422).json({ error: JSON.parse(techResult.error)[0].message });
    }

    req.body.name = req.body.name.trim().replace(/\s+/g, ' ');

    const registerResult = await registerProduct(req.body);

    if (!registerResult.isSuccess) {
      return res.status(422).json({ error: registerResult.error });
    }

    return res.status(201).json({ message: 'Producto registrado correctamente' });
  } catch (error) {
    registerLogError(req, res, error);
    return res.status(500).json({ error: 'Error interno del sersvidor'});
  }
};

export async function getByQuery(req, res) {
  try {
    const { name, barCode} = req.query;

    if (barCode) {
      const result = await getProductByBarCode(barCode);

      if (!result.isSuccess) {
        return res.status(402).json({ error: result.error})
      }
      return res.status(200).json({ product: result.value})
    }

    if (name) {
      const result = await getMatchingProductByName(req.query);

      if (!result.isSuccess) {
        return res.status(402).json({ error: result.error})
      }
      return res.status(200).json({ product: result.value})
    }

    return res.status(402).json({ error: 'Se espera un identificador' });
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