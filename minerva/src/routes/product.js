import {Router} from 'express';
import {register} from '../controllers/product.js';

export const productRouters = Router();

productRouters.post('/register', register);