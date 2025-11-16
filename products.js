// products.js
const fs = require('fs').promises
const path = require('path')

const productsFile = path.join(__dirname, 'data', 'full-products.json')

module.exports = {
  list,
  get
}

/**
 * List products with optional offset, limit, and tag filter
 */
async function list(options = {}) {
  const { offset = 0, limit = 25, tag } = options

  const data = await fs.readFile(productsFile)
  let products = JSON.parse(data)

  // Filter by tag (example: ?tag=electronics)
  if (tag) {
    products = products.filter(p =>
      Array.isArray(p.tags) && p.tags.includes(tag)
    )
  }

  // Pagination
  return products.slice(offset, offset + limit)
}

/**
 * Get a single product by ID
 */
async function get(id) {
  console.log("DEBUG — reading file:", productsFile);
  const data = await fs.readFile(productsFile)
  const products = JSON.parse(data)

  for (let p of products) {
    if (p.id === id) {
      return p
    }
  }

  return null
}
