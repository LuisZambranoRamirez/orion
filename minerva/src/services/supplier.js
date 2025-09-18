import { registerSupplierDB } from '../data/supplier.js';
import { Result } from './Result.js'; // Asegúrate de usar la ruta correcta

import { validateSupplierSchemaBusinessRules } from '../schemas/supplier.js'

export async function registerSupplier(req) {
    const resultBusinessRules = await validateSupplierSchemaBusinessRules(req);

    if (!resultBusinessRules.success) {
        return Result.failure(JSON.parse(resultBusinessRules.error)[0].message);
    }

    const {name, ruc, phone} = resultBusinessRules.data;

    await registerSupplierDB(name, ruc, phone);
}