import {Router} from 'express';
import {register, getCategories, getAll, getByQuery, getSaleModes, updateProduct} from '../controllers/product.js';

export const productRouters = Router();

productRouters.post('/', register);

productRouters.get('/categories', getCategories);

productRouters.get('/saleModes', getSaleModes);

productRouters.get('/', getAll);

productRouters.get('/search', getByQuery);

productRouters.put('/', updateProduct);
