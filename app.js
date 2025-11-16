const fs = require('fs').promises
const path = require('path')
const express = require('express')
const { handleRoot, listProducts, getProduct, createProduct, updateProduct, deleteProduct } = require('./api')
const middleware = require('./middleware')

// Set the port
const port = process.env.PORT || 3000
// Boot the app
const app = express()
// Register the public directory
app.use(express.static(__dirname + '/public'));

// Parse JSON bodies
app.use(express.json())
// Serve static files
app.use(express.static(path.join(__dirname, 'public')))
// CORS middleware
app.use(middleware.cors)

// register the routes
app.get('/products', listProducts)
app.get('/', handleRoot);
// Boot the server
app.listen(port, () => console.log(`Server listening on port ${port}`))
app.get('/products/:id', getProduct)
app.get('/', handleRoot)
app.post('/products', createProduct)
app.put('/products/:id', updateProduct)
app.delete('/products/:id', deleteProduct)

/**
 * Handle the root route
 * @param {object} req
 * @param {object} res
*/
function handleRoot(req, res) {
  res.sendFile(path.join(__dirname, '/index.html'));
}
// 404 + error handlers (must be after routes)
app.use(middleware.notFound)
app.use(middleware.handleError)

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
// Boot the server
app.listen(port, () => console.log(`Server listening on port ${port}`))
