const path = require('path')
const Products = require('./products')
const autoCatch = require('./lib/auto-catch')

function handleRoot (req, res) {
  res.sendFile(path.resolve(__dirname, 'public', 'index.html'))
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

  res.json(product)
}

async function createProduct (req, res) {
  const product = await Products.create(req.body)
  res.status(201).json(product)
}

async function updateProduct (req, res, next) {
  const { id } = req.params
  const updatedProduct = await Products.update(id, req.body)

  if (!updatedProduct) {
    return next()
  }

  res.status(200).json(updatedProduct)
}

async function deleteProduct (req, res, next) {
  const { id } = req.params
  const result = await Products.remove(id)

  if (!result) {
    return next()
  }

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