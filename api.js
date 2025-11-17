const path = require('path')
const Products = require('./products')
const autoCatch = require('./lib/auto-catch')

// Root route: send main page
async function handleRoot (req, res) {
  res.sendFile(path.join(__dirname, 'index.html'))
}

/**
 * List products with pagination + optional tag
 */
async function listProducts (req, res) {
  const { offset = 0, limit = 25, tag } = req.query

  const prints = await Products.list({
    offset: Number(offset),
    limit: Number(limit),
    tag
  })

  res.json(prints)
}

/**
 * Get single product by id
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
 * Create product (fake)
 */
async function createProduct (req, res) {
  const created = await Products.create(req.body)
  res.status(201).json(created)
}

/**
 * Update product (fake)
 */
async function updateProduct (req, res) {
  const { id } = req.params
  await Products.update(id, req.body)
  res.status(200).json({ message: 'Product updated' })
}

/**
 * Delete product (fake)
 */
async function deleteProduct (req, res) {
  const { id } = req.params
  await Products.remove(id)
  res.status(202).json({ message: 'Product deleted' })
}

// autoCatch will wrap all async handlers and send errors to middleware
module.exports = autoCatch({
  handleRoot,
  listProducts,
  getProduct,
  createProduct,
  updateProduct,
  deleteProduct
})
