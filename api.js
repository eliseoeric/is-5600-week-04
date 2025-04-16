const path = require('path')
const Products = require('./products')
const autoCatch = require('./lib/auto-catch')

function handleRoot(req, res) {
  res.sendFile(path.join(__dirname, '/index.html'))
}

async function listProducts(req, res) {
  const { offset = 0, limit = 25, tag } = req.query
  res.json(await Products.list({
    offset: Number(offset),
    limit: Number(limit),
    tag
  }))
}

async function getProduct(req, res, next) {
  const { id } = req.params
  const product = await Products.get(id)
  if (!product) return next()
  res.json(product)
}

async function createProduct(req, res) {
  console.log('Request body:', req.body)
  res.status(201).json(req.body)
}

async function deleteProduct(req, res) {
  const { id } = req.params
  console.log(`Product with ID ${id} deleted`)
  res.status(202).json({ message: `Product ${id} deleted` })
}

async function updateProduct(req, res) {
  const { id } = req.params
  const updatedData = req.body
  console.log(`Product with ID ${id} updated with data:`, updatedData)
  res.status(200).json({ message: `Product ${id} updated`, data: updatedData })
}

module.exports = autoCatch({
  handleRoot,
  listProducts,
  getProduct,
  createProduct,
  deleteProduct,
  updateProduct
})
