import { ProductService } from '../services/product.js';

import { 
  validateProductBusinessRules, 
  validatePartialProductBusiness, 
  validateProductBarCode, 
  validateProductName
} from '../schemas/product.js';

export class ProductController {
  static async updateProduct(req, res) {
    const nameResult = await validateProductName(req.query.name);
    if (!nameResult.success) {
      return res.status(422).json({error: JSON.parse(nameResult.error)[0].message});
    }    

    const productResult = await validatePartialProductBusiness(req.body);    
    if (!productResult.success) {
      return res.status(422).json({error:JSON.parse(productResult.error)[0].message});
    }

    const updateResult = await ProductService.updateProduct(nameResult.data ,productResult.data);

    return updateResult.isSuccess
    ? res.status(200).json({ message: updateResult.value })
    : res.status(422).json({ error: updateResult.error });
  }

  static async register(req, res) {
    const productResult = await validateProductBusinessRules(req.body);

    if (!productResult.success) {
      return res.status(422).json({error:JSON.parse(productResult.error)[0].message});
    }
    
    const registerResult = await ProductService.registerProduct(productResult.data);

    return registerResult.isSuccess
    ? res.status(201).json({ message: registerResult.value })
    : res.status(422).json({ error: registerResult.error });
  }

  static async getByName(req, res) {
    const result = await validateProductName(req.query.name);
    
    if (!result.success) {
      return res.status(422).json({error:JSON.parse(result.error)[0].message});
    }

    const matchingProduct = await ProductService.getProductByName(result.data);

    return matchingProduct.isSuccess
    ? res.status(200).json({ product: matchingProduct.value })
    : res.status(422).json({ error: matchingProduct.error });
  }

  static async getByBarcode(req, res) {
    const result = await validateProductBarCode(req.query.barCode);
    
    if (!result.success) {
      return res.status(422).json({error:JSON.parse(result.error)[0].message});
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
