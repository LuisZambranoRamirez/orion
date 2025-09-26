import express from 'express';
// MIDDLEWARES
import { corsMiddleware } from './middlewares/cors.js';
import { httpMonitorMiddleware } from './middlewares/httpLogger.js';
import { errorHandler } from './middlewares/errorHandler.js';
// ROUTES
import { productRouters } from './routes/product.js';
import { supplierRouters } from './routes/supplier.js';

export const app = express();

app.use(corsMiddleware);
app.disable('x-powered-by');
app.use(express.json());
app.use(httpMonitorMiddleware)

app.get('/',(req, res) => {
  res.send('Drako el mas cerdin cerdon')
});

app.use('/products', productRouters);
app.use('/suppliers', supplierRouters);

app.use((req, res) =>{
  res.status(404).send('404 not found');
});

app.use(errorHandler);
