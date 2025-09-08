import { app } from './app.js';

const port = process.env.PORT || 8081;

app.listen(port, () => {
  console.log(`Servidor minerva en linea en el puerto ${port}`);
});