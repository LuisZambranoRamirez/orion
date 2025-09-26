import { registerSupplier } from '../services/supplier.js';

export class SupplierController {
  static async register(req, res) {
    const supplierResult = await registerSupplier(req.body);

    if (!supplierResult.isSuccess) {
      return res.status(422).json({ error: supplierResult.error });
    }

    return res.status(201).json({ message: 'Proveedor registrado correctamente' });
  };
}
