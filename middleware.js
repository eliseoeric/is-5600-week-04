function cors(req, res, next) {
    const origin = req.headers.origin || '*';
    res.setHeader('Access-Control-Allow-Origin', origin);
    res.setHeader('Access-Control-Allow-Methods', 'POST, GET, PUT, DELETE, OPTIONS');
    res.setHeader('Access-Control-Allow-Headers', 'X-Requested-With, Content-Type, Accept');
    next();
  }
  
  function handleError(err, req, res, next) {
    console.error(err);
    if (res.headersSent) {
      return next(err);
    }
    res.status(500).json({ error: "Internal Server Error" });
  }
  
  function notFound(req, res) {
    res.status(404).json({ error: "Not Found" });
  }
  
  module.exports = {
    cors,
    handleError,
    notFound
  };
  