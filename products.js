// products.js
const fs = require('fs').promises
const path = require('path')

// Path to the product data file
const productsFile = path.join(__dirname, 'data', 'full-products.json')

/**
 * List products with optional limit, offset, and tag filtering
 */
async function list(options = {}) {
  const { offset = 0, limit = 25, tag } = options

  const data = await fs.readFile(productsFile)
  let products = JSON.parse(data)

  // Filter by tag if provided
  if (tag) {
    products = products.filter(p =>
      p.tags && p.tags.includes(tag)
    )
  }

  return products.slice(offset, offset + limit)
}

/**
 * Get a single product by ID
 */
async function get(id) {
  const data = await fs.readFile(productsFile)
  const products = JSON.parse(data)

  return products.find(product => product.id === id) || null
}

/**
 * Fake update (PUT)
 */
async function update(id, newData) {
  console.log("Pretending to update product:", id, newData)
  return newData
}

/**
 * Fake delete (DELETE)
 */
async function remove(id) {
  console.log("Pretending to delete product:", id)
  return true
}

module.exports = {
  list,
  get,
  update,
  remove
}
