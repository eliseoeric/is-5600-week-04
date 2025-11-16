// api.js
const path = require('path')
const Products = require('./products')
const autoCatch = require('./lib/auto-catch')

// Send index.html
async function handleRoot(req, res) {
  res.sendFile(path.join(__dirname, 'public', 'index.html'))
}

// GET /products  (with limit, offset, tag)
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
    return next()   // triggers 404 middleware
  }

  res.json(product)
}

// POST /products
async function createProduct(req, res) {
  console.log("Create product:", req.body)

  res.status(201).json({
    message: "Product created (placeholder)",
    product: req.body
  })
}

// PUT /products/:id
async function updateProduct(req, res) {
  const { id } = req.params

  console.log("Update product:", id, req.body)

  res.status(200).json({
    message: `Product ${id} updated (placeholder)`,
    updated: req.body
  })
}

// DELETE /products/:id
async function deleteProduct(req, res) {
  const { id } = req.params

  console.log("Delete product:", id)

  res.status(202).json({
    message: `Product ${id} deleted (placeholder)`
  })
}

// Auto-wrap everything to catch errors
module.exports = autoCatch({
  handleRoot,
  listProducts,
  getProduct,
  createProduct,
  updateProduct,
  deleteProduct
})
