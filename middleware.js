/**
 * Set CORS headers on the response object.
 * @param {object} req
 * @param {object} res
 * @param {function} next
 */
function cors (req, res, next) {
  const origin = req.headers.origin || '*'

  res.setHeader('Access-Control-Allow-Origin', origin)
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS')
  res.setHeader('Access-Control-Allow-Credentials', 'true')
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Accept, Authorization, X-Requested-With')

  if (req.method === 'OPTIONS') {
    return res.sendStatus(204)
  }

  next()
}

function handleError (err, req, res, next) {
  console.error(err)

  if (res.headersSent) {
    return next(err)
  }

  res.status(500).json({ error: err.message || 'Internal Server Error' })
}

module.exports = {
  cors,
  handleError
}
