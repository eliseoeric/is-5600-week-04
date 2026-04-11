const path = require('path')
const Products = require('./products')
const autoCatch = require('./lib/auto-catch')

/**
 * Handle the root route
 * @param {object} req
 * @param {object} res
 */
function handleRoot(req, res) {
  // Assuming index.html is placed inside the public directory
  res.sendFile(path.join(__dirname, 'index.html'));
}

/**
 * List all products
 * @param {object} req
 * @param {object} res
 */
async function listProducts(req, res) {
  // Extract the limit, offset, and tag query parameters
  const { offset = 0, limit = 25, tag } = req.query
  
  // Pass the limit, offset, and tag to the Products service
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
 * @param {function} next
 */
async function getProduct(req, res, next) {
  const { id } = req.params

  const product = await Products.get(id)
  
  if (!product) {
    // next() without arguments passes to the next route in the stack (e.g. 404 notFound)
    return next()
  }
  
  return res.json(product)
}

/**
 * Create a new product
 * @param {object} req
 * @param {object} res
 */
async function createProduct(req, res) {
  console.log('request body:', req.body)
  res.json(req.body)
}

/**
 * Update a product
 * @param {object} req
 * @param {object} res
 */
async function updateProduct(req, res) {
  const { id } = req.params
  
  await Products.update(id, req.body)
  
  // Return a 200 OK response
  res.status(200).json({ message: `Product ${id} updated successfully` })
}

/**
 * Delete a product
 * @param {object} req
 * @param {object} res
 */
async function deleteProduct(req, res) {
  const { id } = req.params
  
  await Products.destroy(id)
  
  // Return a 202 Accepted response
  res.status(202).json({ message: `Product ${id} deleted successfully` })
}

// Update the module exports to wrap functions in autoCatch
module.exports = autoCatch({
  handleRoot,
  listProducts,
  getProduct,
  createProduct,
  updateProduct,
  deleteProduct
})