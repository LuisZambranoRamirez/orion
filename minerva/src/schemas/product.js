import {z} from 'zod';
import { categories, saleModes } from './enums.js';

export async function validateProductSchemaBusinessRules(object) {
  return productSchemaBusinessRules.safeParseAsync(object);
}

export function validatePartialProductBusinessSchema(object) {
  return productSchemaBusinessRules.partial().safeParseAsync(object);
}

const productSchemaBusinessRules = z.object({
  name: z
  .string()
  .min(3,{message: "El nombre del producto debe tener al menos 3 caracteres"})
  .max(50,{message: "El nombre del producto debe tener como máximo 50 caracteres"}),

  price: z
  .number()
  .positive({message: "El precio debe ser mayor a 0"})
  .refine((val) => val <= 99999999.99, {message: "El precio es demasiado grande"}),

  stock: z
  .number()
  .int({message: "El stock debe ser un número entero"})
  .nonnegative({message: "El stock debe ser mayor o igual a 0"})
  .refine((val) => val <= 99999999, {message: "El stock es demasiado grande"}),

  barCode: z
  .string()
  .length(13,{message: "El código de barras debe tener exactamente 13 caracteres"})
  .regex(/^\d+$/, { message: "El código de barras solo debe contener números" }),

  category: z
  .enum(categories,{
    message: "La categoria no es válida"
  })
});
