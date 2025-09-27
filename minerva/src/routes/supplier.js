import { Router } from 'express';
import { SupplierController } from '../controllers/supplier.js';

export const supplierRouters = Router();

supplierRouters.post('/', SupplierController.register);

supplierRouters.get('/',);

supplierRouters.patch('/',);