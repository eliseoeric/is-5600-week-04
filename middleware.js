// middleware.js

// CORS middleware to allow the frontend to call the API
function cors (req, res, next) {
  res.header('Access-Control-Allow-Origin', '*')
  res.header('Access-Control-Allow-Methods', 'GET,POST,PUT,DELETE,OPTIONS')
  res.header('Access-Control-Allow-Headers', 'Content-Type')

  if (req.method === 'OPTIONS') {
    return res.sendStatus(200)
  }

  next()
}

// 404 handler for unknown routes
function notFound (req, res, next) {
  res.status(404).json({ error: 'Not found' })
}

// Global error handler
function handleError (err, req, res, next) {
  console.error(err.stack || err)

  // If status wasn't already set, default to 500
  if (!res.statusCode || res.statusCode < 400) {
    res.status(500)
  }

  res.json({ error: err.message || 'Server error' })
}

module.exports = {
  cors,
  notFound,
  handleError
}
