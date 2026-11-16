
const path = require('path')
const Products = require('./products')
const autoCatch = require('./lib/auto-catch')

// Handle the root route
function handleRoot(req, res) {
  res.sendFile(path.join(__dirname, '/index.html'))
}

// List products
async function listProducts(req, res) {
  const { offset = 0, limit = 25, tag } = req.query

  res.json(await Products.list({
    offset: Number(offset),
    limit: Number(limit),
    tag
  }))
}

// Get a single product
async function getProduct(req, res, next) {
  const { id } = req.params
  const product = await Products.get(id)

  if (!product) {
    return next()
  }

  return res.json(product)
}

// Create a product
function createProduct(req, res) {
  console.log('Creating product:', req.body)
  res.status(201).json(req.body)
}

// Delete a product
async function deleteProduct(req, res) {
  const { id } = req.params

  await Products.delete(id)

  console.log('Deleting product:', id)
  res.status(202).json({ message: 'Product deletion accepted' })
}

// Update a product
async function updateProduct(req, res) {
  const { id } = req.params

  await Products.update(id, req.body)

  console.log('Updating product:', id)
  res.status(200).json({ message: 'Product updated successfully' })
}

module.exports = {
  handleRoot,
  createProduct,
  ...autoCatch({
    listProducts,
    getProduct,
    deleteProduct,
    updateProduct
  })
}
