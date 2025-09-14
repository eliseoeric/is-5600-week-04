const path = require('path')
const Products = require('./products')
const autoCatch = require('./lib/auto-catch') // if your lab uses it

function handleRoot (req, res) {
  res.sendFile(path.join(__dirname, '/index.html'))
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
  if (!product) return next()
  return res.json(product)
}

// already added earlier in lab:
async function createProduct (req, res) {
  console.log('request body:', req.body)
  res.json(req.body)
}

/** NEW: update product (stub) */
async function updateProduct (req, res) {
  const { id } = req.params
  const result = await Products.update(id, req.body || {})
  return res.status(200).json({ message: `Product ${id} updated`, product: result })
}

/** NEW: delete product (stub) */
async function deleteProduct (req, res) {
  const { id } = req.params
  await Products.remove(id)
  return res.status(202).json({ message: `Product ${id} deleted` })
}

module.exports = autoCatch({
  handleRoot,
  listProducts,
  getProduct,
  createProduct,
  updateProduct,  // <-- add
  deleteProduct   // <-- add
})