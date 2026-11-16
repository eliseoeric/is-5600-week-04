const path = require('path')
const Products = require('./products')

function handleRoot(req, res) {
  res.sendFile(path.join(__dirname, 'public/index.html'))
}

/**
 * List products with pagination + optional tag filter
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
 * Get single product
 */
async function getProduct(req, res, next) {
  const { id } = req.params

  const product = await Products.get(id)

  if (!product) return next()

  res.json(product)
}

/**
 * Create product (mock)
 */
async function createProduct(req, res) {
  console.log('Created product:', req.body)

  res.status(201).json(req.body)
}

/**
 * Delete product (mock)
 */
async function deleteProduct(req, res) {
  const { id } = req.params

  await Products.delete(id)

  res.status(202).json({
    message: `Product ${id} deleted`
  })
}

/**
 * Update product (mock)
 */
async function updateProduct(req, res) {
  const { id } = req.params
  const data = req.body

  await Products.update(id, data)

  res.status(200).json({
    message: `Product ${id} updated`,
    data
  })
}

module.exports = {
  handleRoot,
  listProducts,
  getProduct,
  createProduct,
  deleteProduct,
  updateProduct
}