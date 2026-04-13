const autoCatch = require('./lib/auto-catch')
const path = require('path')
const Products = require('./products')

/**
 * Handle the root route
 */
function handleRoot (req, res) {
  res.sendFile(path.join(__dirname, '/index.html'));
}

/**
 * List all products
 */
async function listProducts (req, res) {
  const { offset = 0, limit = 25, tag } = req.query

  res.json(await Products.list({
    offset: Number(offset),
    limit: Number(limit),
    tag
  }))
}

/**
 * Get single product
 */
async function getProduct (req, res, next) {
  const { id } = req.params

  const product = await Products.get(id)

  if (!product) {
    return next()
  }

  return res.json(product)
}

/**
 * Create product
 */
async function createProduct (req, res) {
  console.log('request body:', req.body)
  res.json(req.body)
}

/**
 * Update product
 */
async function updateProduct (req, res) {
  const { id } = req.params

  console.log(`Product ${id} updated`)

  res.status(200).json({
    message: `Product ${id} updated`
  })
}

/**
 * Delete product
 */
async function deleteProduct (req, res) {
  const { id } = req.params

  console.log(`Product ${id} deleted`)

  res.status(202).json({
    message: `Product ${id} deleted`
  })
}

module.exports = autoCatch({
  handleRoot,
  listProducts,
  getProduct,
  createProduct,
  updateProduct,
  deleteProduct
})