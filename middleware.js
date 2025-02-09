/**
 * CORS Middleware
 */
function cors(req, res, next) {
    res.header('Access-Control-Allow-Origin', '*');
    res.header('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE');
    res.header('Access-Control-Allow-Headers', 'Content-Type');
    next();
  }
  
  /**
   * Handle 404 Not Found
   */
  function notFound(req, res, next) {
    res.status(404).json({ error: 'Not Found' });
  }
  
  /**
   * Error Handling Middleware
   */
  function handleError(err, req, res, next) {
    console.error(err.stack);
    res.status(500).json({ error: 'Internal Server Error' });
  }
  
  // Export middleware functions
  module.exports = { cors, notFound, handleError };
  