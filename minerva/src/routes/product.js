import {Router} from 'express';
import {register, getCategories, getAll, getByQuery} from '../controllers/product.js';

export const productRouters = Router();

productRouters.post('/register', register);

productRouters.get('/categories', getCategories);

// Listado completo
productRouters.get('/', getAll);

// Buscar por nombre o codigo de barras
productRouters.get('/search', getByQuery);
