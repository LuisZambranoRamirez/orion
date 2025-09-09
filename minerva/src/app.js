import express from 'express';
// MIDDLEWARES
import { corsMiddleware } from './middlewares/cors.js';
import { httpMonitorMiddleware, errorHandlingMiddleware } from './middlewares/httpLogger.js';
// ROUTES
import { productRouters } from './routes/product.js';

export const app = express();

app.use(httpMonitorMiddleware)
app.use(express.json());
app.disable('x-powered-by');
app.use(corsMiddleware);

app.get('/',(req, res) => {
  res.send('Hola mundo!!!!')
});

app.use('/product', productRouters);

app.use((req, res) =>{
  res.status(404).send('404 not found');
});

app.use(errorHandlingMiddleware);
