import {z} from 'zod';
import { nameSchema as productNameSchema } from './product.js'; 
import { nameSchema as supplierNameSchema } from './supplier.js';

export async function validateStockEntryBusinessRules(object) {
  return stockEntrySchema.safeParseAsync(object);
}

export const stockEntrySchema = z.object({
    productName: productNameSchema,

    supplierName: supplierNameSchema,

    priceUnit: z
        .number()
        .min(0, {message: "El precio unitario debe ser mayor a cero"})
        .max(99999999.99, {message: "El monto de ganancia es demasiado grande"})
        .refine((val) => /^\d+(\.\d{1,2})?$/.test(val.toString()), {message: "El monto de ganancia solo puede tener hasta dos decimales",}),

    quantity: z
        .int()
        .positive({ message: "La cantidad debe ser un número positivo" })
        .max(4294967295, { message: "La cantidad es demasiado grande" }),
});