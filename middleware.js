// middleware.js

function cors(req, res, next) {
  const origin = req.headers.origin || '*';

  res.setHeader('Access-Control-Allow-Origin', origin);
  res.setHeader('Access-Control-Allow-Methods', 'GET,POST,PUT,DELETE,OPTIONS');
  res.setHeader('Access-Control-Allow-Credentials', 'true');
  res.setHeader('Access-Control-Max-Age', '86400');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type, X-Requested-With');

  if (req.method === 'OPTIONS') {
    return res.sendStatus(204);
  }

  next();
}

function handleError(err, req, res, next) {
  console.error('ERROR:', err);

  if (res.headersSent) {
    return next(err);
  }
  res.status(500).json({ error: 'Internal Error Occurred' });
}

function notFound(req, res) {
  res.status(404).json({ error: 'Not Found' });
}

module.exports = {
  cors,
  handleError,
  notFound
};