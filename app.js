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
module.exports = {
  handleRoot,
  listProducts
}
// app.js
// Add the api module
const api = require('./api')

// update the route handlers
app.get('/', api.handleRoot)
app.get('/products', api.listProducts)
// api.js
const Products = require('./products')

// ...

/**
 * List all products
 * @param {object} req
 * @param {object} res
 */
async function listProducts (req, res) {
  try {
    res.json(await Products.list()) // Use the Products service
  } catch (err) {
    res.status(500).json({ error: err.message })
  }
}
// api.js

/**
 * List all products
 * @param {object} req
 * @param {object} res
 */
async function listProducts (req, res) {

  // Extract the limit and offset query parameters
  const { offset = 0, limit = 25 } = req.query

  try {
    // Pass the limit and offset to the Products service
    res.json(await Products.list({
      offset: Number(offset),
      limit: Number(limit)
    }))
  } catch (err) {
    res.status(500).json({ error: err.message })
  }
}
// app.js

// ...

app.get('/products/:id', api.getProduct)
// api.js

// update the module exports
module.exports = {
  handleRoot,
  listProducts,
  getProduct
}

/**
 * Get a single product
 * @param {object} req
 * @param {object} res
 */
async function getProduct (req, res, next) {
  // Add CORS headers
  res.setHeader('Access-Control-Allow-Origin', '*')

  const { id } = req.params

  try {
    const product = await Products.get(id)
    if (!product) {
      // next() is a callback that will pass the request to the next available route in the stack
      return next()
    }

    return res.json(product)
  } catch (err) {
    res.status(500).json({ error: err.message })
  }
}
// app.js
// Require the middleware module
const middleware = require('middleware')

// Register our upcoming middleware
app.use(middleware.cors)
app.get('/', api.handleRoot)
app.get('/products', api.listProducts)
app.get('/products/:id', api.getProduct)
// api.js
const autoCatch = require('lib/auto-catch')

// Update the module exports
module.exports = autoCatch({
  handleRoot,
  listProducts,
  getProduct
});

// Remove the try/catch from the api methods

/**
 * List all products
 * @param {object} req
 * @param {object} res
 */
async function listProducts (req, res) {
  // Extract the limit and offset query parameters
  const { offset = 0, limit = 25, tag } = req.query
  // Pass the limit and offset to the Products service
  res.json(await Products.list({
    offset: Number(offset),
    limit: Number(limit),
    tag
  }))
}

/**
 * Get a single product
 * @param {object} req
 * @param {object} res
 */
async function getProduct (req, res, next) {
  const { id } = req.params

  const product = await Products.get(id)
  if (!product) {
    return next()
  }
  
  return res.json(product)
}
// app.js
// Add body parser middleware
const bodyParser = require('body-parser')

// ...
app.use(middleware.cors)
app.use(bodyParser.json())

//...
app.post('/products', api.createProduct)
// api.js
/**
 * Create a new product
 * @param {object} req
 * @param {object} res
 */
async function createProduct (req, res) {
  console.log('request body:', req.body)
  res.json(req.body)
}
const express = require("express");
const app = express();
const port = 3000;

const products = require("./products");

app.use(express.json());

// Routes
app.get("/products", products.getProducts);
app.post("/products", products.createProduct);

// New PUT route for updating product
app.put("/products/:id", products.updateProduct);

// New DELETE route for deleting product
app.delete("/products/:id", products.deleteProduct);

app.listen(port, () => {
  console.log(`Server is running on http://localhost:${port}`);
});
// app.js

// ...

app.get('/orders', api.listOrders)
app.get('/orders/', api.createOrder)
