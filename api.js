const path = require('path')
const products = require('./products')

function handleRoot(req, res) {
  res.sendFile(path.join(__dirname, 'index.html'))
}

async function listProducts(req, res) {
  res.setHeader('Access-Control-Allow-Origin', '*')

  const { offset = '0', limit = '25', tag } = req.query

  if (typeof offset !== 'string' || !/^\d+$/.test(offset) ||
      typeof limit !== 'string' || !/^\d+$/.test(limit)) {
    return res.status(400).json({ error: 'Use nonnegative integers for offset and limit.' })
  }

  try {
    const catalog = await products.list({
  offset: Number(offset),
  limit: Number(limit),
  tag
})
    res.json(catalog)
    } catch (err) {
    res.status(500).json({ error: err.message })
  }
}

async function getProduct(req, res, next) {
  res.setHeader('Access-Control-Allow-Origin', '*')

  try {
    const product = await products.get(req.params.id)

    if (!product) {
      return next()
    }

    return res.json(product)
  } catch (err) {
    return res.status(500).json({ error: err.message })
  }
}

function createProduct(req, res) {
  console.log('request body:', req.body)
  return res.json(req.body)
}

function updateProduct(req, res) {
  console.log('Product update requested:', req.params.id, req.body)
  return res.sendStatus(200)
}

function updateProduct(req, res) {
  products.update(req.params.id, req.body)
  return res.sendStatus(200)
}

function deleteProduct(req, res) {
  products.remove(req.params.id)
  return res.sendStatus(202)
}

module.exports = {
  handleRoot,
  listProducts,
  getProduct,
  createProduct,
  updateProduct,
  deleteProduct
}