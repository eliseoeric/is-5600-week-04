const path = require('path')
const Products = require('./products')

function handleRoot (req, res) {
  res.sendFile(path.join(__dirname, 'public/index.js'));
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

async function deleteProduct (req, res) {
  const { id } = req.params
  console.log('Product deleted:', id)
  res.status(202).json({ message: 'Product deleted' })
}

async function updateProduct (req, res) {
  const { id } = req.params
  console.log('Product updated:', id)
  res.status(200).json({ message: 'Product updated' })
}

module.exports = {
  handleRoot,
  listProducts,
  getProduct,
  createProduct,
  deleteProduct,
  updateProduct
}