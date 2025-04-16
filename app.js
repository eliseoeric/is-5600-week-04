const fs = require('fs').promises
const path = require('path')

const express = require('express')
const api = require('./api')
const middleware = require('./middleware')
const bodyParser = require('body-parser')

// Set the port
const port = process.env.PORT || 3000
// Boot the app
const app = express()
// Register the public directory
app.use(express.static(__dirname + '/public'));
// register the routes
app.get('/products', listProducts)
app.get('/', handleRoot);
app.use(middleware.cors)
app.use(bodyParser.json())
app.get('/products', api.listProducts)
app.get('/', api.handleRoot)
app.get('/products/:id', api.getProduct)
app.post('/products', api.createProduct)
app.delete('/products', api.deleteProduct)
app.put('/products', api.putProduct)
app.use(middleware.handleError)
app.use(middleware.notFound)


// Boot the server
app.listen(port, () => console.log(`Server listening on port ${port}`))

/**
 * Handle the root route
 * @param {object} req
 * @param {object} res
*/
function handleRoot(req, res) {
  res.sendFile(path.join(__dirname, '/index.html'));
}

/**
 * List all products
 * @param {object} req
 * @param {object} res
 */
async function listProducts(req, res) {
  const productsFile = path.join(__dirname, 'data/full-products.json')
  try {
    const data = await fs.readFile(productsFile)
    res.json(JSON.parse(data))
  } catch (err) {
    res.status(500).json({ error: err.message })
  }
}
 42 changes: 42 additions & 0 deletions42  
middleware.js
Viewed
Original file line number	Diff line number	Diff line change
@@ -0,0 +1,42 @@
// middleware.js
/**
 * Set the CORS headers on the response object
 * @param {object} req
 * @param {object} res
 * @param {function} next
 */
function cors (req, res, next) {
    const origin = req.headers.origin

    // Set the CORS headers
    res.setHeader('Access-Control-Allow-Origin', origin || '*')
    res.setHeader('Access-Control-Allow-Methods', 'POST, GET, PUT, DELETE, OPTIONS, XMODIFY')
    res.setHeader('Access-Control-Allow-Credentials', true)
    res.setHeader('Access-Control-Max-Age', '86400')
    res.setHeader('Access-Control-Allow-Headers', 'X-Requested-With, X-HTTP-Method-Override, Content-Type, Accept')

    next()
  }

  function handleError (err, req, res, next) {
    // Log the error to our server's console
    console.error(err)

    // If the response has already been sent, we can't send another response
    if (res.headersSent) {
      return next(err)
    }

    // Send a 500 error response
    res.status(500).json({ error: "Internal Error Occurred" })
  }

  function notFound (req, res) {
    res.status(404).json({ error: "Not Found" })
  }

module.exports={
    cors,
    notFound,
    handleError,
}