
const path = require('path')
const Products = require('./products')
const autoCatch = require('./lib/auto-catch')

// Homepage
function handleRoot(req, res) {
  res.sendFile(path.join(__dirname, 'index.html'))
}

// List products
async function listProducts(req, res) {
  const { offset, limit, page, tag, artist } = req.query

  const pageNumber = Math.max(1, Number(page) || 1)
  const pageSize = Math.max(1, Number(limit) || 25)

  const start = offset !== undefined
    ? Math.max(0, Number(offset) || 0)
    : (pageNumber - 1) * pageSize

  let products = await Products.list({
    offset: 0,
    limit: Number.MAX_SAFE_INTEGER,
    tag
  })

  if (artist) {
    products = products.filter(product =>
      product.user &&
      product.user.name &&
      product.user.name.toLowerCase().includes(
        artist.toLowerCase()
      )
    )
  }

  res.json(products.slice(start, start + pageSize))
}

// Get one product
async function getProduct(req, res) {
  const product = await Products.get(req.params.id)

  if (!product) {
    return res.status(404).json({
      error: 'Product not found'
    })
  }

  res.json(product)
}

// Create a product
async function createProduct(req, res) {
  if (!req.body || !req.body.description) {
    return res.status(400).json({
      error: 'Product description is required'
    })
  }

  const product = await Products.create(req.body)
  res.status(201).json(product)
}

// Update a product
async function updateProduct(req, res) {
  const product = await Products.update(
    req.params.id,
    req.body
  )

  if (!product) {
    return res.status(404).json({
      error: 'Product not found'
    })
  }

  res.status(200).json(product)
}

// Delete a product
async function deleteProduct(req, res) {
  const deleted = await Products.remove(req.params.id)

  if (!deleted) {
    return res.status(404).json({
      error: 'Product not found'
    })
  }

  res.status(204).end()
}

module.exports = autoCatch({
  handleRoot,
  listProducts,
  getProduct,
  createProduct,
  updateProduct,
  deleteProduct
})
