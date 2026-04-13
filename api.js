const path = require('path')
const Products = require('./products')
const autoCatch = require('./lib/auto-catch')

// ROOT → loads index.html from main folder
function handleRoot(req, res) {
  res.sendFile(path.join(__dirname, 'index.html'))
}

// GET /products (with pagination + filter)
async function listProducts(req, res) {
  const { offset = 0, limit = 25, tag } = req.query

  const result = await Products.list({
    offset: Number(offset),
    limit: Number(limit),
    tag
  })

  res.json(result)
}

// GET /products/:id
async function getProduct(req, res, next) {
  const { id } = req.params
  const product = await Products.get(id)

  if (!product) {
    return next()
  }

  res.json(product)
}

// POST /products
async function createProduct(req, res) {
  console.log('Product created:', req.body)

  res.status(201).json({
    message: 'Product created successfully',
    product: req.body
  })
}

// PUT /products/:id
async function updateProduct(req, res) {
  const { id } = req.params
  console.log(`Product updated: ${id}`, req.body)

  res.status(200).json({
    message: `Product ${id} updated successfully`,
    product: req.body
  })
}

// DELETE /products/:id
async function deleteProduct(req, res) {
  const { id } = req.params
  console.log(`Product deleted: ${id}`)

  res.status(202).json({
    message: `Product ${id} deleted successfully`
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