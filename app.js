const fs = require('fs').promises
const path = require('path')
const express = require('express')

// Set the port
const port = process.env.PORT || 3000
// Boot the app
const app = express()
// Register the public directory
app.use(express.static(__dirname + '/public'));
// register the routes
app.get('/products', listProducts)
app.get('/', handleRoot);
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
// app.js
const express = require('express')
const path = require('path')
const bodyParser = require('body-parser')

const api = require('./api/api')
const middleware = require('./api/middleware')

const app = express()

// Serve static files from public
app.use(express.static(path.join(__dirname, 'public')))

// Register middlewares
app.use(middleware.cors)
app.use(bodyParser.json())

// Routes
app.get('/', api.handleRoot)
app.get('/products', api.listProducts)
app.get('/products/:id', api.getProduct)

// Create new product
app.post('/products', api.createProduct)

// Update existing product
app.put('/products/:id', api.updateProduct)

// Delete product
app.delete('/products/:id', api.deleteProduct)

// 404 handler (from middleware)
app.use(middleware.notFound)

// Error handler (from middleware)
app.use(middleware.handleError)

// Start server
const port = process.env.PORT || 3000
app.listen(port, () => {
  console.log(`Server listening on port ${port}`)
})
