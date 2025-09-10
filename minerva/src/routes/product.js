import {Router} from 'express';
import {register, getCategories, getAll} from '../controllers/product.js';

export const productRouters = Router();

productRouters.post('/register', register);

productRouters.get('/categories', getCategories);

productRouters.get('/', getAll)