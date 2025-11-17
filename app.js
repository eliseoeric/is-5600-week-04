@@ -1,25 +1,13 @@
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
const Products = require('./products')
const autoCatch = require('./lib/auto-catch')

/**
 /**
 * Handle the root route
 * @param {object} req
 * @param {object} res
*/
function handleRoot(req, res) {
function handleRoot (req, res) {
  res.sendFile(path.join(__dirname, '/index.html'));
}

@@ -28,12 +16,60 @@ function handleRoot(req, res) {
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

async function getProduct (req, res, next) {
  const { id } = req.params

  const product = await Products.get(id)
  if (!product) {
    return next()
  }
}

  return res.json(product)
}

/**
 * Create a new product
 */
async function createProduct(req, res) {
  const newProduct = await Products.create(req.body);
  res.status(201).json(newProduct);
}

/**
* Delete a product
*/
async function deleteProduct(req, res) {
  const { id } = req.params;
  const response = await Products.deleteProduct(id);
  res.status(response.error ? 404 : 202).json(response);
}

/**
* Update a product
*/
async function updateProduct(req, res) {
  const { id } = req.params;
  const updatedProduct = await Products.update(id, req.body);
  res.status(updatedProduct.error ? 404 : 200).json(updatedProduct);
}

module.exports = autoCatch({
  handleRoot,
  listProducts,
  getProduct,
  createProduct,
  deleteProduct,
  updateProduct
});