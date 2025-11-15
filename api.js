// api.js
const path = require('path')
const Products = require('./products')
const autoCatch = require('./lib/auto-catch') // adjust path if needed

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
 * Get a single product
 */
async function getProduct (req, res, next) {
  const { id } = req.params
  const product = await Products.get(id)
  if (!product) return next()
  return res.json(product)
}

/**
 * Create a new product (placeholder)
 */
async function createProduct (req, res) {
  console.log('request body:', req.body)
  // Optionally call Products.create(req.body) if you implement it
  return res.status(201).json(req.body)
}

/**
 * Update an existing product (placeholder)
 * Responds 200 and logs the update; does not have to modify file.
 */
async function updateProduct (req, res) {
  const { id } = req.params
  const updates = req.body

  // Call the service so service can log (optional)
  await Products.update(id, updates)

  // Return 200 (OK) with the updated object (or whatever you want returned)
  return res.status(200).json({
    id,
    ...updates
  })
}

/**
 * Delete a product (placeholder)
 * Responds 202 Accepted and logs the deletion; does not actually delete.
 */
async function deleteProduct (req, res) {
  const { id } = req.params

  // Let service handle logging / pretend-delete
  await Products.delete(id)

  // 202 Accepted indicates request accepted for processing
  return res.status(202).json({ message: `Product ${id} deletion accepted` })
}

module.exports = autoCatch({
  handleRoot,
  listProducts,
  getProduct,
  createProduct,
  updateProduct,
  deleteProduct
})
