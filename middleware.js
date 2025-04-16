/**
 * CORS middleware: Sets headers to allow cross-origin requests
 * @param {object} req
 * @param {object} res
 * @param {function} next
 */
function cors(req, res, next) {
    const origin = req.headers.origin;
  
    res.setHeader('Access-Control-Allow-Origin', origin || '*');
    res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS');
    res.setHeader('Access-Control-Allow-Credentials', 'true');
    res.setHeader('Access-Control-Max-Age', '86400'); // 24 hours
    res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Accept, X-Requested-With, X-HTTP-Method-Override');
  
    next();
  }
  
  /**
   * Central error handler
   * @param {object} err
   * @param {object} req
   * @param {object} res
   * @param {function} next
   */
  function handleError(err, req, res, next) {
    console.error(err); // Log to server
  
    if (res.headersSent) {
      return next(err);
    }
  
    res.status(500).json({ error: 'Internal Error Occurred' });
  }
  
  /**
   * 404 Not Found handler
   * @param {object} req
   * @param {object} res
   */
  function notFound(req, res) {
    res.status(404).json({ error: 'Not Found' });
  }
  
  module.exports = {
    cors,
    handleError,
    notFound
  };
  