import {z} from 'zod';

export async function validateSupplierSchemaBusinessRules(object) {
  return supplierSchemaBusinessRules.safeParseAsync(object);
}

export async function validatePartialSupplierBusiness(object) {
  return supplierSchemaBusinessRules.partial().safeParseAsync(object);
}

export async function validateSupplierName(name) {
  return nameSchema.safeParseAsync(name);
}

const nameSchema = z
  .string()
  .min(3, { message: "El nombre del proveedor debe tener al menos 3 caracteres" })
  .max(50, { message: "El nombre del proveedor debe tener como máximo 50 caracteres" })
  .regex(/^[A-Za-z0-9Ññ\s]+$/, { message: 'El nombre solo puede contener letras sin tildes y/o números' })
  .transform((val) => val.trim().replace(/\s+/g, ' ').toLowerCase());;

const supplierSchemaBusinessRules = z.object({
  name: nameSchema,

  ruc: z
    .string()
    .length(11, { message: "El RUC debe tener exactamente 11 dígitos" })
    .regex(/^\d+$/, { message: "El RUC solo debe contener números" })
    .optional(),

  phone: z
    .string()
    .length(9, { message: "El teléfono debe tener exactamente 9 dígitos" })
    .regex(/^\d+$/, { message: "El teléfono solo debe contener números" })
    .optional()
});