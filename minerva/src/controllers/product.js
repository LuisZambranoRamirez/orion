import {registerProduct, getCategoriesProduct} from '../services/product.js';
import {validateProductSchema} from '../schemas/product.js';

export async function register(req, res) {
  // Reglas tecnicas
  const result = validateProductSchema(req.body);

  if (!result.success) {
    return res.status(422).json({ error: JSON.parse(result.error)[0].message });
  }

  try {
    await registerProduct(result.data)
  } catch (error) {
    if (error.name === 'BusinessError') {
      return res.status(422).json({ error: JSON.parse(error.message)[0].message });
    } else if (error.name === 'DataBaseError') {
      console.log('Error en la base de datos:');
    } 

    return res.status(500).json({ error: 'Error interno del servidor'});
  }

  return res.status(201).json({ message: 'Producto registrado correctamente' });
};

export async function getCategories(req, res) {
  return res.status(200).json({ categories:  getCategoriesProduct()});
}