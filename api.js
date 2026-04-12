const path = require('path')
const Products = require('./products')

module.exports = {
  handleRoot,
  listProducts,
  getProduct,
  createProduct,
  updateProduct,
  deleteProduct
}

function handleRoot (req, res) {
  res.sendFile(path.join(__dirname, '/index.html'))
}

async function listProducts (req, res) {
  const { offset = 0, limit = 25, tag } = req.query

  try {
    const payload = await Products.list({
      offset: Number(offset),
      limit: Number(limit),
      tag
    })
    res.json(payload)
  } catch (err) {
    res.status(500).json({ error: err.message })
  }
}

async function getProduct (req, res) {
  try {
    const product = await Products.get(req.params.id)
    if (!product) {
      return res.status(404).json({ error: 'Product not found' })
    }

    res.json(product)
  } catch (err) {
    res.status(500).json({ error: err.message })
  }
}

async function createProduct (req, res) {
  try {
    if (!req.body || Object.keys(req.body).length === 0) {
      return res.status(400).json({ error: 'Product data is required' })
    }

    const product = await Products.create(req.body)
    res.status(201).json(product)
  } catch (err) {
    res.status(500).json({ error: err.message })
  }
}

async function updateProduct (req, res) {
  try {
    if (!req.body || Object.keys(req.body).length === 0) {
      return res.status(400).json({ error: 'Product data is required' })
    }

    const updated = await Products.update(req.params.id, req.body)
    if (!updated) {
      return res.status(404).json({ error: 'Product not found' })
    }

    res.json(updated)
  } catch (err) {
    res.status(500).json({ error: err.message })
  }
}

async function deleteProduct (req, res) {
  try {
    const removed = await Products.remove(req.params.id)
    if (!removed) {
      return res.status(404).json({ error: 'Product not found' })
    }

    res.status(204).send()
  } catch (err) {
    res.status(500).json({ error: err.message })
  }
}
