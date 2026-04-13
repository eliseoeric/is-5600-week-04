// api.js
const path = require('path')
const Products = require('./products')
const autoCatch = require('./lib/auto-catch')

// root
function handleRoot(req, res) {
  res.sendFile(path.join(__dirname, 'public', 'index.html'))
}

// list products
async function listProducts(req, res) {
  const { offset = 0, limit = 25, tag } = req.query

  res.json(await Products.list({
    offset: Number(offset),
    limit: Number(limit),
    tag
  }))
}

// get single
async function getProduct(req, res, next) {
  const { id } = req.params

  const product = await Products.get(id)
  if (!product) return next()

  res.json(product)
}

// create
async function createProduct(req, res) {
  res.json(req.body)
}

// delete
async function deleteProduct(req, res) {
  const { id } = req.params
  await Products.remove(id)
  res.status(202).json({ message: `Deleted ${id}` })
}

// update
async function updateProduct(req, res) {
  const { id } = req.params
  await Products.update(id, req.body)
  res.status(200).json({ message: `Updated ${id}` })
}

module.exports = autoCatch({
  handleRoot,
  listProducts,
  getProduct,
  createProduct,
  deleteProduct,
  updateProduct
})