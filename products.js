
const fs = require('fs').promises
const path = require('path')

const productsFile = path.join(__dirname, 'data/full-products.json')

module.exports = {
  list,
  get,
  delete: deleteProduct,
  update
}

// List products with filtering and pagination
async function list(options = {}) {
  const { offset = 0, limit = 25, tag } = options

  const data = await fs.readFile(productsFile)
  let products = JSON.parse(data)

  // Filter products by tag
  if (tag) {
    products = products.filter(product =>
      product.tags && product.tags.includes(tag)
    )
  }

  // Apply pagination
  return products.slice(offset, offset + limit)
}

// Get a single product
async function get(id) {
  const products = JSON.parse(
    await fs.readFile(productsFile)
  )

  return products.find(product => product.id === id) || null
}

// Delete a product (demonstration only)
async function deleteProduct(id) {
  console.log(`Product ${id} was deleted`)

  return {
    message: 'Product deleted'
  }
}

// Update a product (demonstration only)
async function update(id, product) {
  console.log(`Product ${id} was updated`)
  console.log('Updated product:', product)

  return {
    message: 'Product updated'
  }
}
