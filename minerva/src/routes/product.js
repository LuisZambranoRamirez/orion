import { Router } from 'express';
import { ProductController } from '../controllers/product.js';

export const productRouters = Router();

productRouters.post('/', ProductController.register);

productRouters.get('/categories', ProductController.getCategories);

productRouters.get('/saleModes', ProductController.getSaleModes);

productRouters.get('/', ProductController.getAll);

productRouters.get('/search', ProductController.getByQuery);

productRouters.put('/', ProductController.updateProduct);
