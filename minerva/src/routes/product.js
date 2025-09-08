import {Router} from 'express';
import {register, getCategories} from '../controllers/product.js';

export const productRouters = Router();

productRouters.post('/register', register);

productRouters.get('/categories', getCategories);