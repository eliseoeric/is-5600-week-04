// api.js
const path = require('path')
const Products = require('./products')
const autoCatch = require('./lib/auto-catch')

// ----- Route handlers -----

/**
 * Handle the root route
 * @param {object} req
 * @param {object} res
 */
async function handleRoot (req, res) {
  // adjust path if your index.html is somewhere else
  res.sendFile(path.join(__dirname, 'public/index.html'))
}

/**
 * List all products (with offset/limit/tag)
 * @param {object} req
 * @param {object} res
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
 * Get a single product
 * @param {object} req
 * @param {object} res
 * @param {function} next
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
 * Create a new product (stub)
 * @param {object} req
 * @param {object} res
 */
async function createProduct (req, res) {
  const created = await Products.create(req.body)
  console.log('Product created:', created)

  // 201 = created
  res.status(201).json(created)
}

/**
 * Update a product (PUT – stub)
 * @param {object} req
 * @param {object} res
 */
async function updateProduct (req, res) {
  const { id } = req.params
  const updated = await Products.update(id, req.body)

  console.log('Product updated:', id)

  // 200 = OK
  res.status(200).json(updated)
}

/**
 * Delete a product (DELETE – stub)
 * @param {object} req
 * @param {object} res
 */
async function deleteProduct (req, res) {
  const { id } = req.params
  await Products.remove(id)

  console.log('Product deleted:', id)

  // 202 = accepted
  res.status(202).json({ id, status: 'deleted' })
}

// Wrap in autoCatch so errors go to middleware.handleError
module.exports = autoCatch({
  handleRoot,
  listProducts,
  getProduct,
  createProduct,
  updateProduct,
  deleteProduct
})
