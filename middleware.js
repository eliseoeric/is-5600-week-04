function cors(req, res, next) {
    // Set CORS headers to allow cross-origin requests
    res.setHeader('Access-Control-Allow-Origin', req.headers.origin || '*'); // Allow requests from any origin or specific origin
    res.setHeader('Access-Control-Allow-Methods', 'POST, GET, PUT, DELETE, OPTIONS'); // Supported HTTP methods
    res.setHeader('Access-Control-Allow-Credentials', 'true'); // Allow credentials (cookies, authorization headers)
    res.setHeader('Access-Control-Max-Age', '86400'); // Cache preflight response for 24 hours
    res.setHeader('Access-Control-Allow-Headers', 'X-Requested-With, Content-Type, Accept'); // Allowed headers in the request
  
    next(); // Move to the next middleware
  }
  
  function handleError(err, req, res, next) {
    // Log the error to the server console for debugging
    console.error(err);
  
    // If the response has already been sent, skip the error handling
    if (res.headersSent) return next(err);
  
    // Send a generic 500 Internal Server Error response
    res.status(500).json({ error: 'Internal Server Error' });
  }
  
  function notFound(req, res) {
    // Handle undefined routes and send a 404 response
    res.status(404).json({ error: 'Not Found' });
  }
  
  module.exports = { cors, handleError, notFound };