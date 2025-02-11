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
  res.json(product)
}

async function updateProduct(req, res) {
  const { id } = req.params
  console.log(`Updating product ${id} with:`, req.body)
  res.status(200).json({ message: `Product ${id} updated successfully` })
}

async function deleteProduct(req, res) {
  const { id } = req.params
  console.log(`Deleting product ${id}`)
  res.status(202).json({ message: `Product ${id} deleted successfully` })
}

module.exports = autoCatch({
  handleRoot,
  listProducts,
  getProduct,
  createProduct,
  updateProduct,
  deleteProduct
})