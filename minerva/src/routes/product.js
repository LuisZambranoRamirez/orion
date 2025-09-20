import {Router} from 'express';
import {register, getCategories, getAll, getByQuery, getSaleModes} from '../controllers/product.js';

export const productRouters = Router();

productRouters.post('/', register);

productRouters.get('/categories', getCategories);

productRouters.get('/saleModes', getSaleModes);

// Listado completo
productRouters.get('/', getAll);

// Buscar por nombre o codigo de barras
productRouters.get('/search', getByQuery);
