import {z} from 'zod';

export async function validateProductSchemaBusinessRules(object) {
  return productSchemaBusinessRules.safeParseAsync(object);
}

export function validatePartialProductBusinessSchema(object) {
  return productSchemaBusinessRules.partial().safeParseAsync(object);
}


export const categories = ['Bebidas', 'Abarrotes/Secos', 'Café/Infusiones', 'Lácteos', 'Carnes', 'Snacks/Golosinas', 'Higiene/Cuidado Personal', 'Limpieza/hogar', 'Bebés/Mamá', 'Mascotas','otros'];
const saleModes = ['Unidad', 'Granel', 'Unidad/Granel'];

const productSchemaBusinessRules = z.object({
  name: z
  .string()
  .min(3,{message: "El nombre del producto debe tener al menos 3 caracteres"})
  .max(50,{message: "El nombre del producto debe tener como máximo 50 caracteres"}),

  gainAmount: z
  .number()
  .positive({message: "El monto de ganancia debe ser mayor a 0"})
  .max(99999999.99, {message: "El monto de ganancia es demasiado grande"}),

  reorderLevel: z
  .int()
  .min(0 , "El nivel minimo para la alerta del stock debe ser mayor a cero")
  .max(4294967295 , "El nivel maximo para la alerta del stock debe ser menor a 4 294 967 295")
  .optional(),

  barCode: z
  .string()
  .length(13,{message: "El código de barras debe tener exactamente 13 caracteres"})
  .regex(/^\d+$/, {message: "El código de barras solo debe contener números"}),

  saleMode: z
  .enum(saleModes, {message: "El modo de venta no es válido"}),

  category: z
  .enum(categories,{message: "La categoria no es válida"})
});
