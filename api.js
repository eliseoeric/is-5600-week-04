// api.js
const path = require('path')
const Products = require('./products')
const autoCatch = require('./lib/auto-catch')

// ---- Route Handlers ----

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
  console.log('request body:', req.body)
  res.json(req.body)
}

async function updateProduct(req, res) {
  console.log('UPDATE product:', req.params.id)
  console.log('request body:', req.body)

  res.status(200).json({
    status: 'updated',
    id: req.params.id,
    body: req.body
  })
}

async function deleteProduct(req, res) {
  console.log('DELETE product:', req.params.id)

  res.status(202).json({
    status: 'deleted',
    id: req.params.id
  })
}

// Export wrapped in auto-catch
module.exports = autoCatch({
  handleRoot,
  listProducts,
  getProduct,
  createProduct,
  updateProduct,
  deleteProduct
})
