import { ProductService } from '../services/product.js';
import { validateProductNameFormat } from '../schemas/product.js';

export class ProductController {
  static async updateProduct(req, res) {
    if (!req.body.name) {
      return res.status(422).json({ error: 'Se necesita el nombre del producto' });
    }

    const updateResult = await ProductService.updateExistingProduct(req.body);

    return !updateResult.isSuccess
      ? res.status(422).json({ error: updateResult.error })
      : res.status(200).json({ message: 'Producto actualizado correctamente' });
  }

  static async register(req, res) {
    const techResult = await validateProductNameFormat(req.body.name);

    if (!techResult.success) {
      return res.status(422).json({ error: JSON.parse(techResult.error)[0].message });
    }

    req.body.name = req.body.name.trim().replace(/\s+/g, ' ');

    const registerResult = await ProductService.registerProduct(req.body);

    return !registerResult.isSuccess
      ? res.status(422).json({ error: registerResult.error })
      : res.status(201).json({ message: 'Producto registrado correctamente' });
  }

  static async getByQuery(req, res) {
    const { name, barCode } = req.query;

    if (barCode) {
      const result = await ProductService.getProductByBarCode(barCode);

      return !result.isSuccess
        ? res.status(422).json({ error: result.error })
        : res.status(200).json({ product: result.value });
    }

    if (name) {
      const result = await ProductService.getMatchingProductByName(name);

      return !result.isSuccess
        ? res.status(422).json({ error: result.error })
        : res.status(200).json({ product: result.value });
    }

    return res.status(422).json({ error: 'Se necesita un identificador' });
  }

  static async getAll(req, res) {
    return res.status(200).json({ products: await ProductService.getAllProducts() });
  }

  static async getCategories(req, res) {
    return res.status(200).json({ categories: ProductService.getCategoriesProduct() });
  }

  static async getSaleModes(req, res) {
    return res.status(200).json({ salesmodes: ProductService.getSaleModesProduct() });
  }
}
