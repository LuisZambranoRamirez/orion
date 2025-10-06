import { Router } from 'express';
import { ProductController } from '../controllers/product.js';

export const productRouters = Router();

productRouters.post('/', ProductController.register);

productRouters.get('/categories', ProductController.getCategories);

productRouters.get('/sale-modes', ProductController.getSaleModes);

productRouters.get('/', ProductController.getAll);

productRouters.get('/by-name', ProductController.getByName);

productRouters.get('/by-barcode', ProductController.getByBarcode);

productRouters.patch('/', ProductController.updateProduct);

productRouters.get('/matching-name', ProductController.getListMatchingName);