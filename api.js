const path = require('path')
const Products = require('./products')

function autoCatch(handler) {
  return async function (req, res, next) {
    try {
      await handler(req, res, next)
    } catch (error) {
      next(error)
    }
  }
}

async function handleRoot(req, res) {
  res.sendFile(path.join(__dirname, 'index.html'))
}

async function listProducts(req, res) {
  const offset = Number(req.query.offset) || 0
  const limit = Number(req.query.limit) || 25
  const tag = req.query.tag

  const products = await Products.list({ offset, limit, tag })
  res.json(products)
}

async function getProduct(req, res, next) {
  const product = await Products.get(req.params.id)

  if (!product) {
    return next()
  }

  res.json(product)
}

async function createProduct(req, res) {
  const product = await Products.create(req.body)
  res.status(201).json(product)
}

async function deleteProduct(req, res) {
  const { id } = req.params
  await Products.remove(id)
  res.status(202).json({ message: `Product ${id} deleted` })
}

async function updateProduct(req, res) {
  const { id } = req.params
  const updated = await Products.update(id, req.body)
  res.status(200).json(updated)
}

module.exports = {
  handleRoot: autoCatch(handleRoot),
  listProducts: autoCatch(listProducts),
  getProduct: autoCatch(getProduct),
  createProduct: autoCatch(createProduct),
  deleteProduct: autoCatch(deleteProduct),
  updateProduct: autoCatch(updateProduct)
}