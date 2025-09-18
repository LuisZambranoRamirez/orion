import { registerSupplier } from '../services/supplier.js';

export async function register(req, res) {
  // Aqui debe ir reglas tecnicas cuando las haya
  try {
    const result = await registerSupplier(req.body);

    if (!result.isSuccess) {
      return res.status(422).json({ error: result.error });
    }
  } catch (error) {
    if (error.name === 'DataBaseError') {
      console.log('Error en la base de datos:');
    }

    // PARA DEBUGUEAR 
    console.log(error);

    return res.status(500).json({ error: 'Error interno del sersvidor'});
  }

  return res.status(201).json({ message: 'Proveedor registrado correctamente' });
};