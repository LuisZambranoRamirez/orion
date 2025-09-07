import mysql from 'mysql2/promise';

const config = {
  host:'localhost',
  port: 3306,
  database: 'apolo',
  user: '',
  password: '',

  //Si todas las conexiones estan en uso, las solicitudes adicionales se quedaran en cola
  waitForConnections: true,
  //El numero maximo de conexiones simultaneas que el pool puede crear
  connectionLimit: 10,
  //Con un valor de 0, se establece que no hay límite en la cantidad de solicitudes que se pueden poner en cola. 
  queueLimit: 0
};

const connection = mysql.createPool(config);

export default connection;
