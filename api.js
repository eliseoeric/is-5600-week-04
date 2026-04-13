const path = require('path')
const Products = require('./products')
const autoCatch = require('./lib/auto-catch')

module.exports = autoCatch({
  handleRoot,
  listProducts,
  getProduct,
  createProduct,
  updateProduct,
  deleteProduct
})

function handleRoot (req, res) {
  res.sendFile(path.join(__dirname, 'index.html'))
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
  const product = await Products.get(req.params.id)
  if (!product) return next()
  res.json(product)
}

async function createProduct (req, res) {
  const product = await Products.create(req.body)
  res.status(201).json(product)
}

async function updateProduct (req, res) {
  const product = await Products.update(req.params.id, req.body)
  res.status(200).json(product)
}

async function deleteProduct (req, res) {
  await Products.remove(req.params.id)
  res.status(202).json({ message: "Deleted" })
}