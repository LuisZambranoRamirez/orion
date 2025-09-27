import { SupplierRepository } from '../data/supplier.js';
import { Result } from './Result.js'; 

export class SupplierService {
    static async registerSupplier({name, ruc, phone}) {
        name = name.trim().replace(/\s+/g, ' ').toLowerCase();

        if (await SupplierRepository.isSupplierRegistered(name)) {
            return Result.failure(`El proveedor -- ${name} -- ya está registrado`);
        }

        if (ruc && await SupplierRepository.isSupplierRucExists(ruc)) {
            return Result.failure(`El RUC -- ${ruc} -- ya está registrado`);
        }

        if (phone && await SupplierRepository.isSupplierPhoneExists(phone)) {
            return Result.failure(`El teléfono -- ${phone} -- ya está registrado`);
        }

        const registerResult = await SupplierRepository.registerSupplier({ name, ruc, phone});
        return registerResult
        ? Result.success('Proveedor registrado con éxito')
        : Result.failure('No se pudo registrar el proveedor');
    }

    static async getAllSuppliers() {
        const suppliers = await SupplierRepository.getAllSuppliers();
        return suppliers.length === 0
        ? Result.failure('No hay proveedores registrados')
        : Result.success(suppliers);
    }

    static async updateSupplier(nameId, {name, ruc, phone}) {
        nameId = nameId.trim().replace(/\s+/g, ' ').toLowerCase();

        if (!(await SupplierRepository.isSupplierRegistered(nameId))) {
            return Result.failure(`El proveedor -- ${nameId} -- no está registrado`);
        }

        if (name) {
            name = name.trim().replace(/\s+/g, ' ').toLowerCase();
            if (await SupplierRepository.isSupplierRegistered(name)) {
                return Result.failure(`El proveedor -- ${name} -- ya está registrado`);
            }
        }

        if (ruc && await SupplierRepository.isSupplierRucExists(ruc)) {
            return Result.failure(`El RUC -- ${ruc} -- ya está registrado`);
        }

        if (phone && await SupplierRepository.isSupplierPhoneExists(phone)) {
            return Result.failure(`El teléfono -- ${phone} -- ya está registrado`);
        }

        const updateResult = await SupplierRepository.updateSupplierByIdentifier(nameId, {name, ruc, phone});
        return updateResult
        ? Result.success('Proveedor actualizado con éxito')
        : Result.failure('No se pudo actualizar el proveedor');
    }

    static async getSupplierByName(name) {
        name = name.trim().replace(/\s+/g, ' ').toLowerCase();
        const supplier = await SupplierRepository.getSupplierByIdentifier(name);
        return supplier.length === 0
        ? Result.failure(`El proveedor -- ${name} -- no está registrado`)
        : Result.success(supplier);
    }
        
}