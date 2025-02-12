// CORS middleware
function cors(req, res, next) {
    res.header('Access-Control-Allow-Origin', '*');
    res.header('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE');
    res.header('Access-Control-Allow-Headers', 'Content-Type, Authorization');
    next();
  }
  
  // 404 Not Found middleware
  function notFound(req, res, next) {
    res.status(404).json({ message: 'Route not found' });
  }
  
  // Error handling middleware
  function handleError(err, req, res, next) {
    console.error(err.stack);
    res.status(500).json({ message: 'Something went wrong!' });
  }
  
  // Export middleware
  module.exports = {
    cors,
    notFound,
    handleError,
  };