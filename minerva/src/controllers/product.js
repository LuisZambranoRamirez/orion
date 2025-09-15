import {registerProduct, getCategoriesProduct, getAllProducts} from '../services/product.js';

export async function register(req, res) {
  try {
    await registerProduct(result.data)
  } catch (error) {
    if (error.name === 'BusinessError') {
      return res.status(422).json({ error: error.message });
    } else if (error.name === 'DataBaseError') {
      console.log('Error en la base de datos:');
    }
    // PARA DEBUGUEAR 
    console.log(error);
    return res.status(500).json({ error: 'Error interno del sersvidor'});
  }

  return res.status(201).json({ message: 'Producto registrado correctamente' });
};

export async function getAll(req, res) {
  return res.status(200).json({ products: await getAllProducts()});
}

export async function getCategories(req, res) {
  return res.status(200).json({ categories:  getCategoriesProduct()});
}

/**
 * GET /search?name=...&barCode=...
 * - Si viene barCode => busca por codigo EXACTO
 * - Si viene name => busca por nombre (LIKE %name%)
 * - Si no vienen parametros => 400
 */
export async function getByQuery(req, res) {
  const { name, barCode } = req.query;

  if (!name && !barCode) {
    return res.status(400).json({ error: 'Se requiere query param name o barCode' });
  }

  try {
    const products = await getProductsByFilter({ name, barCode });
    return res.status(200).json({ products });
  } catch (error) {
    if (error.name === 'BusinessError') {
      return res.status(422).json({ error: error.message });
    } else if (error.name === 'DataBaseError') {
      console.log('Error en la base de datos:');
    }
    console.log(error);
    return res.status(500).json({ error: 'Error interno del servidor' });
  }
}