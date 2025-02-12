// middleware.js
/**
 * Set the CORS headers on the response object
 * @param {object} req
 * @param {object} res
 * @param {function} next
 */
function cors(req, res, next) {
  const origin = req.headers.origin;

  // Set the CORS headers
  res.setHeader('Access-Control-Allow-Origin', origin || '*');
  res.setHeader('Access-Control-Allow-Methods', 'POST, GET, PUT, DELETE, OPTIONS, PATCH');
  res.setHeader('Access-Control-Allow-Credentials', 'true');
  res.setHeader('Access-Control-Max-Age', '86400');
  res.setHeader('Access-Control-Allow-Headers', 'X-Requested-With, X-HTTP-Method-Override, Content-Type, Accept');

  next();
}

/**
* Middleware to handle errors
* @param {object} err
* @param {object} req
* @param {object} res
* @param {function} next
*/
function handleError(err, req, res, next) {
  console.error(err);

  // If headers are already sent, delegate to the default error handler
  if (res.headersSent) {
      return next(err);
  }

  res.status(500).json({ error: "Internal Error Occurred" });
}

/**
* Middleware to handle 404 Not Found errors
* @param {object} req
* @param {object} res
*/
function notFound(req, res) {
  res.status(404).json({ error: "Not Found" });
}

module.exports = {
  cors,
  handleError,
  notFound
};
