const path = require('path')
const Products = require('./products')
const autoCatch = require('./lib/auto-catch')

async function handleRoot(req, res) {
  res.sendFile(path.join(__dirname, '/index.html'))
}

async function listProducts(req, res) {
  const { offset = 0, limit = 25, tag } = req.query

  const products = await Products.list({
    offset: Number(offset),
    limit: Number(limit),
    tag
  })

  res.json(products)
}

async function getProduct(req, res, next) {
  const { id } = req.params

  const product = await Products.get(id)
  if (!product) {
    return next()
  }

  return res.json(product)
}

async function createProduct(req, res) {
  const product = await Products.create(req.body)
  res.status(201).json(product)
}

async function updateProduct(req, res, next) {
  const { id } = req.params
  const product = await Products.update(id, req.body)
  if (!product) {
    return next()
  }
  res.json(product)
}

async function deleteProduct(req, res) {
  const { id } = req.params
  await Products.remove(id)
  res.status(202).json({ success: true })
}

module.exports = autoCatch({
  handleRoot,
  listProducts,
  getProduct,
  createProduct,
  updateProduct,
  deleteProduct
}) 
