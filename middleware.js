// middleware.js

function cors(req, res, next) {
  const origin = req.headers.origin

  res.setHeader('Access-Control-Allow-Origin', origin || '*')
  res.setHeader('Access-Control-Allow-Methods', 'POST, GET, PUT, DELETE, OPTIONS')
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Accept')
  next()
}

function notFound(req, res) {
  res.status(404).json({ error: "Not Found" })
}

function handleError(err, req, res, next) {
  console.error(err)
  if (res.headersSent) return next(err)
  res.status(500).json({ error: "Internal Error Occurred" })
}

module.exports = {
  cors,
  notFound,
  handleError
}
