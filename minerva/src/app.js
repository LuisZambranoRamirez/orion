import express from 'express';
// MIDDLEWARES
import { corsMiddleware } from './middlewares/cors.js';
import { httpMonitorMiddleware } from './middlewares/httpLogger.js';
// ROUTES
import { productRouters } from './routes/product.js';

export const app = express();

app.use(corsMiddleware);
app.disable('x-powered-by');
app.use(express.json());
app.use(httpMonitorMiddleware)

app.get('/',(req, res) => {
  res.send('Drako el mas cerdin cerdon')
});

app.use('/product', productRouters);

app.use((req, res) =>{
  res.status(404).send('404 not found');
});
