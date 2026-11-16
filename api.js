const path = require('path')
const Products = require('./products')
const autoCatch = require('./lib/auto-catch')

// Handle home page
function handleRoot(req, res) {
  res.sendFile(path.join(__dirname, 'index.html'))
}

// List products with filtering and pagination
async function listProducts(req, res) {
  const { offset = 0, limit = 25, tag } = req.query

  const products = await Products.list({
    offset: Number(offset),
    limit: Number(limit),
    tag
  })

  res.json(products)
}

// Get single product
async function getProduct(req, res, next) {
  const { id } = req.params

  const product = await Products.get(id)

  if (!product) {
    return next()
  }

  res.json(product)
}

// Create product
async function createProduct(req, res) {
  console.log('request body:', req.body)
  res.json(req.body)
}

// Update product
async function updateProduct(req, res) {
  const result = await Products.update(
    req.params.id,
    req.body
  )

  res.status(200).json(result)
}

// Export all API functions

async function deleteProduct(req, res) {
  const result = await Products.remove(req.params.id)

  res.status(202).json(result)
}

module.exports = autoCatch({
  handleRoot,
  listProducts,
  getProduct,
  createProduct,
  updateProduct,
  deleteProduct
})

