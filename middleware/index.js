function cors(req, res, next) {
    res.setHeader('Access-Control-Allow-Origin', '*')
    res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE')
    res.setHeader('Access-Control-Allow-Headers', 'Content-Type')
    next()
  }
  
  function handleError(err, req, res, next) {
    console.error(err.stack)
    res.status(500).json({ error: 'Something went wrong!' })
  }
  
  module.exports = {
    cors,
    handleError
  }
  