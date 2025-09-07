const acceptedOrigins = [
  'http://localhost:8080'
];

export function corsMiddleware(req, res, next) {
  const origin = req.header('origin');

  if(acceptedOrigins.includes(origin)) {
    res.setHeader('Access-Control-Allow-Origin', origin);
    res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PATCH, DELETE');
    res.header('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content-Type, Accept, Authorization');
  }
  next();
}