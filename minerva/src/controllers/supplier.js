import { SupplierService } from '../services/supplier.js';
import { validateSupplierSchemaBusinessRules, validatePartialSupplierBusiness, validateSupplierName } from '../schemas/supplier.js';

export class SupplierController {
  static async register(req, res) {
    const supplierResult = await validateSupplierSchemaBusinessRules(req.body);

    if (!supplierResult.success) {
      return res.status(422).json({error: JSON.parse(supplierResult.error)[0].message});
    }

    const registerResult = await SupplierService.registerSupplier(supplierResult.data);

    return registerResult.isSuccess
    ? res.status(201).json({ message: registerResult.value })
    : res.status(422).json({ error: registerResult.error });
  };

  static async getAll(req, res) {
    const suppliersResult = await SupplierService.getAllSuppliers();
    return suppliersResult.isSuccess
    ? res.status(200).json({ suppliers: suppliersResult.value })
    : res.status(422).json({ error: suppliersResult.error });
  }

  static async update(req, res) {
    const supplierNameResult = await validateSupplierName(req.query.name);

    if (!supplierNameResult.success) {
      return res.status(422).json({error:JSON.parse(supplierNameResult.error)[0].message});
    }  

    const supplierResult = await validatePartialSupplierBusiness(req.body);
    if (!supplierResult.success) {
      return res.status(422).json({error:JSON.parse(supplierResult.error)[0].message});
    }

    const updateResult = await SupplierService.updateSupplier(supplierNameResult.data, supplierResult.data);

    return updateResult.isSuccess
    ? res.status(200).json({ message: updateResult.value })
    : res.status(422).json({ error: updateResult.error });
  }

  static async getByName(req, res) {
    const supplierNameResult = await validateSupplierName(req.query.name);
    if (!supplierNameResult.success) {
      return res.status(422).json({error:JSON.parse(supplierNameResult.error)[0].message});
    }

    const supplierResult = await SupplierService.getSupplierByName(supplierNameResult.data);

    return supplierResult.isSuccess
    ? res.status(200).json({ suppliers: supplierResult.value })
    : res.status(422).json({ error: supplierResult.error });
  }

}

