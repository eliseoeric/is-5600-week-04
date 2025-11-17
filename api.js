const path = require('path')
const Products = require('./products')
const autoCatch = require('./lib/auto-catch')

function handleRoot (req, res) {
  res.sendFile(path.join(__dirname, 'index.html'))
}

/**
 * List products with optional pagination + tag filter
 */
async function listProducts (req, res) {
  const { offset = 0, limit = 25, tag } = req.query

  const products = await Products.list({
    offset: Number(offset),
    limit: Number(limit),
    tag
  })

  res.json(products)
}

/**
 * Get a single product by ID
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
 * Create a new product (placeholder)
 */
async function createProduct (req, res) {
  console.log('createProduct body:', req.body)

  // Just echo back the body for now
  res.status(201).json(req.body)
}

/**
 * Update a product (placeholder)
 */
async function updateProduct (req, res) {
  const { id } = req.params
  console.log('updateProduct id:', id, 'body:', req.body)

  res.status(200).json({
    message: 'Product updated',
    id,
    data: req.body
  })
}

/**
 * Delete a product (placeholder)
 */
async function deleteProduct (req, res) {
  const { id } = req.params
  console.log('deleteProduct id:', id)

  res.status(202).json({
    message: 'Product deleted',
    id
  })
}

// Wrap everything with autoCatch so errors go to handleError middleware
module.exports = autoCatch({
  handleRoot,
  listProducts,
  getProduct,
  createProduct,
  updateProduct,
  deleteProduct
})
