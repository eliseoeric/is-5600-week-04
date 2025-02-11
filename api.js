const path = require('path')
const Products = require('./products')
const autoCatch = require('./lib/auto-catch')

/**
 * Handle the root route
 * @param {object} req
 * @param {object} res
 */
async function handleRoot(req, res) {
  res.sendFile(path.join(__dirname, 'public', 'index.html'))
}

/**
 * List all products
 * @param {object} req
 * @param {object} res
 */
async function listProducts(req, res) {
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
async function getProduct(req, res, next) {
  const { id } = req.params
  const product = await Products.get(id)
  if (!product) {
    return next()
  }
  
  return res.json(product)
}

/**
 * Create a new product (Placeholder for now)
 * @param {object} req
 * @param {object} res
 */
async function createProduct(req, res) {
  console.log('Request body:', req.body) // Log request body for debugging
  res.json(req.body) // Return received data
}

/**
 * DELETE a product
 * @param {object} req
 * @param {object} res
 */
async function deleteProduct(req, res) {
  const { id } = req.params
  const result = await Products.deleteProduct(id)
  res.status(202).json(result)  // Send 202 Accepted response
}

/**
 * UPDATE a product
 * @param {object} req
 * @param {object} res
 */
async function updateProduct(req, res) {
  const { id } = req.params
  const updatedData = req.body
  const result = await Products.updateProduct(id, updatedData)
  res.status(200).json(result)  
}

// Use autoCatch to wrap all handlers
module.exports = autoCatch({
  handleRoot,
  listProducts,
  getProduct,
  createProduct,
  deleteProduct,  
  updateProduct   
})
