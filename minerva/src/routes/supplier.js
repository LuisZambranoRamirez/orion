import { Router } from 'express';
import { register } from '../controllers/supplier.js';

export const supplierRouters = Router();

supplierRouters.post('/register', register);
