import { ProductService } from '../services/product.js';
import { validateProductNameFormat } from '../schemas/product.js';

export class ProductController {
  static async updateProduct(req, res) {
    if (!req.query.name) {
      return res.status(422).json({ error: 'Se necesita el nombre del producto' });
    }

    const updateResult = await ProductService.updateProduct(req.body);

    return updateResult.isSuccess
    ? res.status(200).json({ message: updateResult.value })
    : res.status(422).json({ error: updateResult.error });
  }

  static async register(req, res) {
    const techResult = await validateProductNameFormat(req.body.name);

    if (!techResult.success) {
      return res.status(422).json({ error: JSON.parse(techResult.error)[0].message });
    }

    req.body.name = req.body.name.trim().replace(/\s+/g, ' ').toLowerCase();

    const registerResult = await ProductService.registerProduct(req.body);

    return registerResult.isSuccess
    ? res.status(201).json({ message: registerResult.value })
    : res.status(422).json({ error: registerResult.error });
  }

  static async getByQuery(req, res) {
    const { name, barCode } = req.query;

    if (barCode) {
      const result = await ProductService.getProductByBarCode(barCode);

      return result.isSuccess
      ? res.status(200).json({ product: result.value })
      : res.status(422).json({ error: result.error });
    }

    if (name) {
      const result = await ProductService.getMatchingProductByName(name);

      return result.isSuccess
      ? res.status(200).json({ product: result.value })
      : res.status(422).json({ error: result.error });
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
