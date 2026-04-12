const path = require('path')
const Products = require('./products')
const autoCatch = require('./lib/auto-catch')

// ROOT
function handleRoot (req, res) {
  res.sendFile(path.join(__dirname, '/public/index.html'))
}

// LIST
async function listProducts (req, res) {
  const { offset = 0, limit = 25, tag } = req.query

  res.json(await Products.list({
    offset: Number(offset),
    limit: Number(limit),
    tag
  }))
}

// GET ONE
async function getProduct (req, res, next) {
  const product = await Products.get(req.params.id)

  if (!product) return next()

  res.json(product)
}

// CREATE
async function createProduct (req, res) {
  console.log('Created:', req.body)
  res.json(req.body)
}

// DELETE
async function deleteProduct (req, res) {
  await Products.remove(req.params.id)
  res.status(202).json({ message: "Deleted" })
}

// UPDATE
async function updateProduct (req, res) {
  await Products.update(req.params.id, req.body)
  res.status(200).json({ message: "Updated" })
}

module.exports = autoCatch({
  handleRoot,
  listProducts,
  getProduct,
  createProduct,
  deleteProduct,
  updateProduct
})