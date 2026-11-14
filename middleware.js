function cors(req, res, next) {
  res.setHeader('Access-Control-Allow-Origin', '*')
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS')
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Accept')

  if (req.method === 'OPTIONS') {
    return res.sendStatus(204)
  }

  next()
}

function notFound(req, res) {
  res.status(404).json({ error: 'Not Found' })
}

function handleError(err, req, res, next) {
  console.error(err)

  if (res.headersSent) {
    return next(err)
  }

  res.status(500).json({ error: 'Internal Error Occurred' })
}

module.exports = { cors, notFound, handleError }