// api.js

const path = require('path')
const Products = require('./products')
const autoCatch = require('./lib/auto-catch')

/**
 * Handle the root route
 * @param {object} req
 * @param {object} res
 */
function handleRoot(req, res) {
  res.sendFile(path.join(__dirname, '/index.html'))
}

/**
 * List products with optional pagination + tag filter
 */
async function listProducts(req, res) {
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
 */
async function getProduct(req, res, next) {
  const { id } = req.params
  const product = await Products.get(id)

  if (!product) return next() // triggers 404

  res.json(product)
}

/**
 * Create a product (placeholder functionality per README)
 */
async function createProduct(req, res) {
  console.log('request body:', req.body)
  res.json(req.body)
}

/**
 * Update a product (placeholder)
 */
async function updateProduct(req, res) {
  console.log('update product:', req.params.id, req.body)
  res.json({
    status: 'updated',
    id: req.params.id,
    body: req.body
  })
}

/**
 * Delete a product (placeholder)
 */
async function deleteProduct(req, res) {
  console.log('delete product:', req.params.id)
  res.status(202).json({
    status: 'deleted',
    id: req.params.id
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
