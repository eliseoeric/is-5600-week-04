const path = require('path')
const Products = require('./products')
const autoCatch = require('./lib/auto-catch')

/**
 * Handle root
 */
function handleRoot(req, res) {
  res.sendFile(path.join(__dirname, 'public/index.html'))
}

/**
 * List products
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
 * Get single product
 */
async function getProduct(req, res, next) {
  const { id } = req.params

  const product = await Products.get(id)

  if (!product) return next()

  res.json(product)
}

/**
 * Create product (already given)
 */
async function createProduct(req, res) {
  console.log('Created:', req.body)

  res.json(req.body)
}

/**
 * DELETE product (NEW)
 */
async function deleteProduct(req, res) {
  const { id } = req.params

  console.log(`Deleted product: ${id}`)

  res.status(202).json({
    message: `Product ${id} deleted (fake)`
  })
}

/**
 * UPDATE product (NEW)
 */
async function updateProduct(req, res) {
  const { id } = req.params

  console.log(`Updated product: ${id}`, req.body)

  res.status(200).json({
    message: `Product ${id} updated (fake)`,
    data: req.body
  })
}

module.exports = autoCatch({
  handleRoot,
  listProducts,
  getProduct,
  createProduct,
  deleteProduct,
  updateProduct
})
