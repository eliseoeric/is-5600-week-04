const path = require('path')
const Products = require('./products')
const autoCatch = require('./lib/auto-catch')

async function handleRoot(req, res) {
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
  const product = req.body
  console.log('Product created:', product)
  res.status(201).json(product)
}

async function deleteProduct(req, res) {
  const { id } = req.params
  await Products.remove(id)
  console.log(`Product with ID ${id} deleted`)
  res.status(202).json({ message: `Product ${id} deleted` })
}

async function updateProduct(req, res) {
  const { id } = req.params
  const updatedProduct = req.body
  await Products.update(id, updatedProduct)
  console.log(`Product with ID ${id} updated`)
  res.status(200).json({ message: `Product ${id} updated` })
}

module.exports = autoCatch({
  handleRoot,
  listProducts,
  getProduct,
  createProduct,
  deleteProduct,
  updateProduct
})
