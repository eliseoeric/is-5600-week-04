const path = require('path')
const Products = require('./products')
const autoCatch = require('./lib/auto-catch')

function handleRoot(req, res) {
  res.sendFile(path.join(__dirname, 'public/index.html'))
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
  console.log('request body:', req.body)
  res.status(201).json(req.body)
}

async function updateProduct(req, res) {
  const { id } = req.params
  console.log(`Product ${id} updated`, req.body)
  res.status(200).json({ message: `Product ${id} updated` })
}

async function deleteProduct(req, res) {
  const { id } = req.params
  console.log(`Product ${id} deleted`)
  res.status(202).json({ message: `Product ${id} deleted` })
}

module.exports = autoCatch({
  handleRoot,
  listProducts,
  getProduct,
  createProduct,
  updateProduct,
  deleteProduct
})