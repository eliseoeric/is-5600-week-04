// middleware.js

/**
 * Set the CORS headers on the response object
 * @param {object} req
 * @param {object} res
 * @param {function} next
 */
function cors(req, res, next) {
    const origin = req.headers.origin || '*'; // Default to '*' if no origin is provided
  
    // Set the CORS headers
    res.setHeader('Access-Control-Allow-Origin', origin);
    res.setHeader('Access-Control-Allow-Methods', 'POST, GET, PUT, DELETE, OPTIONS, PATCH');
    res.setHeader('Access-Control-Allow-Credentials', 'true');
    res.setHeader('Access-Control-Max-Age', '86400');  // Cache for 1 day
    res.setHeader('Access-Control-Allow-Headers', 'X-Requested-With, X-HTTP-Method-Override, Content-Type, Accept');
  
    next();
  }
  
  /**
   * Global error handler for internal errors
   * @param {Error} err
   * @param {object} req
   * @param {object} res
   * @param {function} next
   */
  function handleError(err, req, res, next) {
    console.error(err); // Log the error
  
    if (res.headersSent) {
      return next(err); // If headers are already sent, pass the error to the default error handler
    }
  
    res.status(500).json({ error: 'Internal Error Occurred' });
  }
  
  /**
   * Handle 404 errors when a route is not found
   * @param {object} req
   * @param {object} res
   */
  function notFound(req, res) {
    res.status(404).json({ error: 'Not Found' });
  }
  
  module.exports = {
    cors,
    notFound,
    handleError,
  };
  