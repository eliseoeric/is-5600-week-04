
const path = require('path')
const Products = require('./products')
const autoCatch = require('./lib/auto-catch')

// Handle root route
function handleRoot(req, res) {
  res.sendFile(path.join(__dirname, 'index.html'))
}

// List all products
async function listProducts(req, res) {
  const { offset = 0, limit = 25, tag } = req.query

  const products = await Products.list({
    offset: Number(offset),
    limit: Number(limit),
    tag
  })

  res.json(products)
}

// Get a single product
async function getProduct(req, res, next) {
  const { id } = req.params

  const product = await Products.get(id)

  if (!product) {
    return next()
  }

  return res.json(product)
}

// Create a product
async function createProduct(req, res) {
  console.log('Request body:', req.body)

  res.status(201).json(req.body)
}

// Update a product
async function updateProduct(req, res) {
  const { id } = req.params

  await Products.update(id, req.body)

  res.status(200).json({
    message: `Product ${id} updated successfully`,
    product: req.body
  })
}

// Delete a product
async function deleteProduct(req, res) {
  const { id } = req.params

  await Products.delete(id)

  res.status(202).json({
    message: `Product ${id} deleted successfully`
  })
}

// Export API methods with automatic error handling
module.exports = autoCatch({
  handleRoot,
  listProducts,
  getProduct,
  createProduct,
  updateProduct,
  deleteProduct
})
