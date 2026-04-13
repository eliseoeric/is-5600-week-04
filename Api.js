const path = require('path')
const Products = require('./products')
const autoCatch = require('./lib/auto-catch')

function handleRoot(req, res) {
  res.sendFile(path.join(__dirname, 'index.html'))
}

async function listProducts(req, res) {
  const { offset = 0, limit = 25, tag } = req.query

  const result = await Products.list({
    offset: Number(offset),
    limit: Number(limit),
    tag
  })

  res.json(result)
}

async function getProduct(req, res, next) {
  const { id } = req.params
  const product = await Products.get(id)

  if (!product) {
    return next()
  }

  res.json(product)
}

async function createProduct(req, res) {
  const newProduct = await Products.create(req.body)
  res.status(201).json(newProduct)
}

async function updateProduct(req, res) {
  const { id } = req.params
  const updated = await Products.update(id, req.body)
  res.status(200).json(updated)
}

async function deleteProduct(req, res) {
  const { id } = req.params
  const result = await Products.remove(id)
  res.status(202).json(result)
}

module.exports = autoCatch({
  handleRoot,
  listProducts,
  getProduct,
  createProduct,
  updateProduct,
  deleteProduct
})