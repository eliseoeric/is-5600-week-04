// CORS middleware to allow cross-origin requests
function cors(req, res, next) {
    const origin = req.headers.origin;
    res.setHeader('Access-Control-Allow-Origin', origin || '*');
    res.setHeader('Access-Control-Allow-Methods', 'POST, GET, PUT, DELETE, OPTIONS');
    res.setHeader('Access-Control-Allow-Credentials', true);
    res.setHeader('Access-Control-Max-Age', '86400');
    res.setHeader('Access-Control-Allow-Headers', 'X-Requested-With, Content-Type, Accept');
    next();
  }
  
  // Error handling middleware
  function handleError(err, req, res, next) {
    console.error(err);
    if (res.headersSent) {
      return next(err);
    }
    res.status(500).json({ error: "Internal Server Error" });
  }
  
  // 404 Not Found middleware
  function notFound(req, res) {
    res.status(404).json({ error: "Not Found" });
  }
  
  module.exports = {
    cors,
    handleError,
    notFound
  };
  