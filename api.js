// api/api.js
const path = require('path')
const Products = require('../products')
const autoCatch = require('../lib/auto-catch')

// Handle the root route - send the static index.html
function handleRoot (req, res) {
  res.sendFile(path.join(__dirname, '..', 'public', 'index.html'))
}

/**
 * List all products with optional offset, limit, tag
 */
async function listProducts (req, res) {
  const { offset = 0, limit = 25, tag } = req.query

  const data = await Products.list({
    offset: Number(offset),
    limit: Number(limit),
    tag
  })

  // return an object with items + total (if available)
  res.json({
    items: data.items,
    total: data.total
  })
}

/**
 * Get a single product
 */
async function getProduct (req, res, next) {
  const { id } = req.params
  const product = await Products.get(id)
  if (!product) {
    return next() // triggers 404
  }
  return res.json(product)
}

/**
 * Create a new product (placeholder)
 */
async function createProduct (req, res) {
  // Use Products.create to persist or simulate persistence
  const created = await Products.create(req.body)
  // Return created product (or echo)
  res.status(201).json(created)
}

/**
 * Update a product (placeholder)
 */
async function updateProduct (req, res) {
  const { id } = req.params
  const updated = await Products.update(id, req.body)
  // return updated resource or status
  res.status(200).json(updated)
}

/**
 * Delete a product (placeholder)
 */
async function deleteProduct (req, res) {
  const { id } = req.params
  await Products.remove(id)
  // return 202 Accepted, as requested
  res.status(202).json({ message: `Product ${id} deletion accepted` })
}

// Export wrapped by autoCatch so we don't need try/catch in every handler
module.exports = autoCatch({
  handleRoot,
  listProducts,
  getProduct,
  createProduct,
  updateProduct,
  deleteProduct
})
