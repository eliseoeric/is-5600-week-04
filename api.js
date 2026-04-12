const path = require('path')
const api = require('./products')
const autoCatch = require('./lib/auto-catch')

async function handleRoot (req, res) {
  res.sendFile(path.join(__dirname, '/index.html'))
}

async function listProducts (req, res) {
  const { offset = 0, limit = 25, tag } = req.query
  const products = await api.list({
    offset: Number(offset),
    limit: Number(limit),
    tag
  })
  res.json(products)
}

async function getProduct (req, res, next) {
  const { id } = req.params
  const product = await api.get(id)

  if (!product) {
    return next()
  }

  return res.json(product)
}

async function createProduct (req, res) {
  const product = await api.create(req.body)
  res.status(201).json(product)
}

async function updateProduct (req, res) {
  const { id } = req.params
  const updated = await api.update(id, req.body)
  res.json(updated)
}

async function deleteProduct (req, res) {
  await api.remove(req.params.id)
  res.status(202).json({ message: 'Product deleted' })
}

module.exports = autoCatch({
  handleRoot,
  listProducts,
  getProduct,
  createProduct,
  updateProduct,
  deleteProduct
})
