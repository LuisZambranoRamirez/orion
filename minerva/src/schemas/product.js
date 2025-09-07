import {z} from 'zod';

export function validateProductSchema(object) {
  return productSchema.safeParse(object);
}

export function validateProductSchemaBusinessRules(object) {
  return productSchemaBusinessRules.safeParse(object);
}

const productSchema = z.object({
  name: z.string({
    invalid_type_error: "El nombre debe ser una cadena de texto",
    required_error: "El nombre es obligatorio"
  }),
  price: z.number({
    invalid_type_error: "El precio debe ser un número",
    required_error: "El precio es obligatorio"
  }),
  stock: z.number({
    invalid_type_error: "El stock debe ser un número",
    required_error: "El stock es obligatorio"
  }),
  barCode: z.string({
    invalid_type_error: "El código de barras debe ser una cadena de texto",
    required_error: "El código de barras es obligatorio"
  }),
  category: z.string({
    invalid_type_error: "La categoría debe ser una cadena de texto",
    required_error: "La categoría es obligatoria"
  })
});

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
  .string().length(13,{message: "El código de barras debe tener exactamente 13 caracteres"}),

  category: z
  .enum(['Bebidas', 'Abarrotes/Secos', 'Café/Infusiones', 'Lácteos', 'Carnes', 'Snacks/Golosinas', 'Higiene/Cuidado Personal', 'Limpieza/hogar', 'Bebés/Mamá', 'Mascotas','otros'],{
    message: "La categoria no es válida"
  })
});
