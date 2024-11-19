function cors(req, res, next) {
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE');
    res.setHeader('Access-Control-Allow-Headers', 'Content-Type');
    next();
  }
  
  function handleError(err, req, res, next) {
    console.error(err);
    res.status(500).json({ error: 'Internal server error' });
  }
  
  function notFound(req, res) {
    res.status(404).json({ error: 'Not found' });
  }
  
  module.exports = {
    cors,
    handleError,
    notFound,
  };
  