const fs = require('fs').promises
const path = require('path')

const productsFile = path.join(__dirname, 'data/full-products.json')

/**
 * List all products
 */
async function list(options = {}) {
  const { offset = 0, limit = 25, tag } = options
  const data = await fs.readFile(productsFile)
  let products = JSON.parse(data)

  // Step 6: Filter by tag if one is provided
  if (tag) {
    products = products.filter(p => p.tags && p.tags.some(t => t.title === tag))
  }

  return products.slice(offset, offset + limit)
}

/**
 * Get a single product by ID
 */
async function get(id) {
  const products = JSON.parse(await fs.readFile(productsFile))
  return products.find(p => p.id === id) || null
}

/**
 * Placeholder for deleting a product
 */
async function deleteProduct(id) {
  console.log(`Product ${id} was deleted`)
  return true
}

/**
 * Placeholder for updating a product
 */
async function update(id, change) {
  console.log(`Product ${id} was updated with:`, change)
  return true
}

module.exports = {
  list,
  get,
  deleteProduct,
  update
}