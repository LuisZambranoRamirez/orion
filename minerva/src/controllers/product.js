import { ProductService } from '../services/product.js';

import { 
  validateProductBusinessRules, 
  validatePartialProductBusiness, 
  validateProductBarCode, 
  validateProductName
} from '../schemas/product.js';

export class ProductController {
  static async updateProduct(req, res) {
    if (!req.query.name) {
      return res.status(422).json({ error: 'Se necesita el nombre del producto' });
    }

    const result = await validatePartialProductBusiness(req.body);    
    if (!result.success) {
      return res.status(422).json(JSON.parse(result.error)[0].message);
    }

    const updateResult = await ProductService.updateProduct(req.body);

    return updateResult.isSuccess
    ? res.status(200).json({ message: updateResult.value })
    : res.status(422).json({ error: updateResult.error });
  }

  static async register(req, res) {
    const result = await validateProductBusinessRules(req.body);

    if (!result.success) {
      return res.status(422).json(JSON.parse(result.error)[0].message);
    }
    
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

  static async getByName(req, res) {
    const result = await validateProductName(req.query.name);
    
    if (!result.success) {
      return res.status(422).json(JSON.parse(result.error)[0].message);
    }

    const matchingProduct = await ProductService.getMatchingProductByName(result.data);

    return matchingProduct.isSuccess
    ? res.status(200).json({ product: matchingProduct.value })
    : res.status(422).json({ error: matchingProduct.error });
  }

  static async getByBarcode(req, res) {
    const result = await validateProductBarCode(barCode);
    
    if (!result.success) {
      return res.status(422).json(result.error);
    }
    
    const productByBarCode = await ProductService.getProductByBarCode(result.data);

    return productByBarCode.isSuccess
    ? res.status(200).json({ product: productByBarCode.value })
    : res.status(422).json({ error: productByBarCode.error });
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
