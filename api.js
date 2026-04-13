// api.js
const path = require('path')
const Products = require('./products')
const autoCatch = require('./lib/auto-catch')

/**
 * Handle the root route
 * @param {object} req
 * @param {object} res
 */
function handleRoot (req, res) {
  res.sendFile(path.join(__dirname,'public', '/index.html'))
}

/**
 * List all products
 * @param {object} req
 * @param {object} res
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
 * @param {object} req
 * @param {object} res
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
 * Create a new product
 * @param {object} req
 * @param {object} res
 */
async function createProduct (req, res) {
  console.log('request body:', req.body)
  const product = await Products.create(req.body)
  res.json(product)
}

/**
 * Update a product
 * @param {object} req
 * @param {object} res
 */
async function updateProduct (req, res) {
  const { id } = req.params
  console.log('update product:', id, req.body)
  const product = await Products.update(id, req.body)
  res.json(product)
}

/**
 * Delete a product
 * @param {object} req
 * @param {object} res
 */
async function deleteProduct (req, res) {
  const { id } = req.params
  console.log('deleted product:', id)
  await Products.remove(id)
  res.sendStatus(202)
}

module.exports = autoCatch({
  handleRoot,
  listProducts,
  getProduct,
  createProduct,
  updateProduct,
  deleteProduct
})