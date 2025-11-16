
const path = require('path')
const Products = require('./products')

function handleRoot(req, res) {
  res.sendFile(path.join(__dirname, '/index.html'))
}

// GET /products (supports limit, offset, tag)
async function listProducts(req, res) {
  const { offset = 0, limit = 25, tag } = req.query

  const products = await Products.list({
    offset: Number(offset),
    limit: Number(limit),
    tag
  })

  res.json(products)
}

// GET /products/:id
async function getProduct(req, res, next) {
  const { id } = req.params
  const product = await Products.get(id)

  if (!product) return next()   // go to 404 handler
  res.json(product)
}

module.exports = {
  handleRoot,
  listProducts,
  getProduct
}
