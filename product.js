const fs = require('fs').promises
const path = require('path')

const productsFile = path.join(__dirname, 'data/full-products.json')

module.exports = {
  list,
  get,
  delete: remove,
  update
}

/**
 * List products with pagination + tag filter
 */
async function list(options = {}) {
  const { offset = 0, limit = 25, tag } = options

  const data = await fs.readFile(productsFile)
  let products = JSON.parse(data)

  // Filter by tag if provided
  if (tag) {
    products = products.filter(p => p.tags && p.tags.includes(tag))
  }

  // Pagination
  return products.slice(offset, offset + limit)
}

/**
 * Get one product
 */
async function get(id) {
  const products = JSON.parse(await fs.readFile(productsFile))

  return products.find(p => p.id === id) || null
}

/**
 * Delete (mock)
 */
async function remove(id) {
  console.log(`Deleted product ${id}`)
  return true
}

/**
 * Update (mock)
 */
async function update(id, data) {
  console.log(`Updated product ${id}`, data)
  return true
}