const fs = require('fs').promises
const path = require('path')
const express = require('express')
const api = require('./api')
const middleware = require('./middleware')
const bodyParser = require('body-parser')
const app = express()

// Register our upcoming middleware
app.use(middleware.cors)
app.get('/', api.handleRoot)
app.get('/products', api.listProducts)
app.get('/products/:id', api.getProduct)

// Set the port
const port = process.env.PORT || 3000
// Boot the app
// Register the public directory
app.use(express.static(__dirname + '/public'));
app.use(middleware.cors)


// app.use(middleware.cors)
// register the routes
// 
// register the routes
app.get('/products', listProducts)
app.get('/', handleRoot);
app.use(middleware.cors)
app.use(bodyParser.json())
app.get('/products', api.listProducts)
app.get('/', api.handleRoot);
app.get('/products/:id', api.getProduct)
app.post('/products', api.createProduct)
app.post('/DELETE', deleteProduct);
app.put('/Update', updateProduct);
app.put('/products/:id', api.updateProduct); 
app.delete('/products/:id', api.deleteProduct); 
app.use(middleware.notFound)
app.use(middleware.handleError)

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

function deleteProduct(req, res) {
  res.status(202).json({ message: 'deleted' })
}

function updateProduct(req, res) {
  res.status(200).json({ message: 'product updated' })
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
// Add the api module