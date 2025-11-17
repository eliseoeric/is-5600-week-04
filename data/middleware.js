// middleware.js

/**
 * CORS middleware
 */
function cors(req, res, next) {
  const origin = req.headers.origin;
  res.setHeader('Access-Control-Allow-Origin', origin || '*');
  res.setHeader('Access-Control-Allow-Methods', 'POST, GET, PUT, DELETE, OPTIONS, PATCH');
  res.setHeader('Access-Control-Allow-Credentials', 'true'); // string value for header
  res.setHeader('Access-Control-Max-Age', '86400');
  res.setHeader('Access-Control-Allow-Headers', 'X-Requested-With, X-HTTP-Method-Override, Content-Type, Accept');

  // Preflight request handling
  if (req.method === 'OPTIONS') {
    return res.status(204).end();
  }
  next();
}

/**
 * Error handler middleware
 */
function handleError(err, req, res, next) {
  console.error(err);
  if (res.headersSent) return next(err);
  res.status(500).json({ error: "Internal Error Occurred" });
}

/**
 * Not Found handler
 */
function notFound(req, res) {
  res.status(404).json({ error: "Not Found" });
}

module.exports = {
  cors,
  handleError,
  notFound
};
