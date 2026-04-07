const path = require('path')
const Products = require('./products')

function handleRoot (req, res) {
  res.sendFile(path.join(__dirname, 'index.html'))
}

async function listProducts (req, res) {
  const { offset = 0, limit = 25, tag } = req.query

  try {
    const products = await Products.list({
      offset: Number(offset),
      limit: Number(limit),
      tag
    })

    res.json(products)
  } catch (err) {
    res.status(500).json({ error: err.message })
  }
}

async function getProduct (req, res, next) {
  const { id } = req.params

  try {
    const product = await Products.get(id)

    if (!product) {
      return next()
    }

    return res.json(product)
  } catch (err) {
    res.status(500).json({ error: err.message })
  }
}

async function createProduct (req, res, next) {
  try {
    const product = await Products.create(req.body)
    res.status(201).json(product)
  } catch (err) {
    next(err)
  }
}

async function updateProduct (req, res, next) {
  const { id } = req.params

  try {
    const product = await Products.update(id, req.body)

    if (!product) {
      return res.status(404).json({ error: 'Product not found' })
    }

    res.json(product)
  } catch (err) {
    next(err)
  }
}

async function deleteProduct (req, res, next) {
  const { id } = req.params

  try {
    const deleted = await Products.remove(id)

    if (!deleted) {
      return res.status(404).json({ error: 'Product not found' })
    }

    res.status(202).json({ message: 'Product deleted' })
  } catch (err) {
    next(err)
  }
}

module.exports = {
  handleRoot,
  listProducts,
  getProduct,
  createProduct,
  updateProduct,
  deleteProduct
}
