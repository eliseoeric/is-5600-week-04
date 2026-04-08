const path = require('path')
const Products = require('./products')
const autoCatch = require('./lib/auto-catch')

/**
 * Handle the root route
 */
function handleRoot(req, res) {
  res.sendFile(path.join(__dirname, '/index.html'));
}

/**
 * List all products
 */
async function listProducts(req, res) {
  const { offset = 0, limit = 25, tag } = req.query
  res.json(await Products.list({
    offset: Number(offset),
    limit: Number(limit),
    tag
  }))
}

/**
 * Get a single product
 */
async function getProduct(req, res, next) {
  const { id } = req.params
  const product = await Products.get(id)
  
  if (!product) {
    return next() // Pass to 404 handler
  }

  return res.json(product)
}

/**
 * Create a new product
 */
async function createProduct(req, res) {
  console.log('request body:', req.body)
  res.json(req.body)
}

/**
 * Update an existing product
 */
async function editProduct(req, res) {
  await Products.update(req.params.id, req.body)
  res.status(200).json({ message: "Product updated" })
}

/**
 * Delete a product
 */
async function deleteProduct(req, res) {
  await Products.deleteProduct(req.params.id)
  res.status(202).json({ message: "Product deleted" })
}

module.exports = autoCatch({
  handleRoot,
  listProducts,
  getProduct,
  createProduct,
  editProduct,
  deleteProduct
})