// api.js
const path = require('path')
const Products = require('./products')

/**
 * Show the home page (index.html)
 */
function handleRoot (req, res) {
  // your index.html is in the same folder as app.js
  res.sendFile(path.join(__dirname, 'index.html'))
}

/**
 * List products (supports limit, offset, tag)
 */
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
    console.error(err)
    res.status(500).json({ error: 'Something went wrong' })
  }
}

/**
 * Get 1 product by id
 */
async function getProduct (req, res, next) {
  const { id } = req.params

  try {
    const product = await Products.get(id)

    if (!product) {
      return next() // later this can go to a 404 handler
    }

    return res.json(product)
  } catch (err) {
    console.error(err)
    res.status(500).json({ error: 'Something went wrong' })
  }
}

/**
 * Create a new product (fake for now)
 */
async function createProduct (req, res) {
  console.log('Create product:', req.body)
  res.status(201).json(req.body)
}

/**
 * Update a product (fake)
 */
async function updateProduct (req, res) {
  console.log('Update product:', req.params.id, req.body)
  res.status(200).json({
    message: 'Product updated',
    id: req.params.id,
    updated: req.body
  })
}

/**
 * Delete a product (fake)
 */
async function deleteProduct (req, res) {
  console.log('Delete product:', req.params.id)
  res.status(202).json({
    message: 'Product deleted',
    id: req.params.id
  })
}

module.exports = {
  handleRoot,
  listProducts,
  getProduct,
  createProduct,
  updateProduct,
  deleteProduct
}
