import {registerProduct} from '../services/product.js';
import {validateProductSchema} from '../schemas/product.js';

export async function register(req, res) {
  // Reglas tecnicas
  const result = validateProductSchema(req.body);

  if (!result.success) {
    return res.status(422).json({ error: result.error.message });
  }

  try {
    await registerProduct(result.data)
  } catch (error) {
    if (error.name === 'BusinessError') {
      return res.status(400).json({ error: error.message });
    } else if (error.name === 'DataBaseError') {
    
    } 

    return res.status(500).json({ error: 'Error interno del servidor'});
  }

  return res.status(201).json({ message: 'Producto registrado correctamente' });
};