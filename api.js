const path = require('path')
const Products = require('./products')
const autoCatch = require('./lib/auto-catch')

function handleRoot (req, res) {
  res.sendFile(path.join(__dirname, '/index.html'))
}

async function listProducts (req, res) {
  const { offset = 0, limit = 25, tag } = req.query

  res.json(await Products.list({
    offset: Number(offset),
    limit: Number(limit),
    tag
  }))
}

async function getProduct (req, res, next) {
  const { id } = req.params

  const product = await Products.get(id)
  if (!product) {
    return next()
  }

  return res.json(product)
}

async function createProduct (req, res) {
  console.log('request body:', req.body)
  res.json(req.body)
}

async function updateProduct (req, res) {
  console.log('Updating product:', req.params.id)
  console.log('Update data:', req.body)
  res.status(200).json({ message: 'Product updated successfully', id: req.params.id, data: req.body })
}

async function deleteProduct (req, res) {
  console.log('Deleting product:', req.params.id)
  res.status(202).json({ message: 'Product deleted successfully', id: req.params.id })
}

module.exports = autoCatch({
  handleRoot,
  listProducts,
  getProduct,
  createProduct,
  updateProduct,
  deleteProduct
})
