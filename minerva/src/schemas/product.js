import {z} from 'zod';

export async function validateProductBusinessRules(object) {
  return productBusinessRulesSchema.safeParseAsync(object);
}

export async function validatePartialProductBusiness(object) {
  return productBusinessRulesSchema.partial().safeParseAsync(object);
}

export async function validateProductName(name) {
  return nameSchema.safeParseAsync(name);
}

export async function validateProductBarCode(barCode) {
  return barCodeschema.safeParseAsync(barCode);
}

export const categories = ['Bebidas', 'Abarrotes/Secos', 'Café/Infusiones', 'Lácteos', 'Carnes', 'Snacks/Golosinas', 'Higiene/Cuidado Personal', 'Limpieza/hogar', 'Bebés/Mamá', 'Mascotas','otros'];
export const saleModes = ['Unidad', 'Granel', 'Unidad/Granel'];

const nameSchema = z
  .string()
  .min(3,{message: "El nombre del producto debe tener al menos 3 caracteres"})
  .max(50,{message: "El nombre del producto debe tener como máximo 50 caracteres"})
  .regex(/^[A-Za-z0-9Ññ\s]+$/, {message: 'El nombre solo puede contener letras sin tildes y/o números'});

const barCodeschema = z
  .string()
  .length(13,{message: "El código de barras debe tener exactamente 13 caracteres"})
  .regex(/^\d+$/, {message: "El código de barras solo debe contener números"});

const productBusinessRulesSchema = z.object({
  name: nameSchema,

  gainAmount: z
  .number()
  .positive({message: "El monto de ganancia debe ser mayor a 0"})
  .max(99999999.99, {message: "El monto de ganancia es demasiado grande"}),

  stock: z
  .int()
  .min(0, "El nivel minimo de stock debe ser mayor o igual a cero")
  .max(4294967295, "El nivel maximo para el stock debe ser menor a 4 294 967 295"),

  reorderLevel: z
  .int()
  .min(0 , "El nivel minimo para la alerta del stock debe ser mayor a cero")
  .max(4294967295 , "El nivel maximo para la alerta del stock debe ser menor a 4 294 967 295")
  .optional(),

  barCode: barCodeschema,

  saleMode: z
  .enum(saleModes, {message: "El modo de venta no es válido"}),

  category: z
  .enum(categories,{message: "La categoria no es válida"})
});
