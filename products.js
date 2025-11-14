// products.js
const fs = require('fs').promises
const path = require('path')

const PRODUCTS_FILE = path.join(__dirname, 'data', 'full-products.json')

async function readProducts () {
  const data = await fs.readFile(PRODUCTS_FILE, 'utf8')
  return JSON.parse(data)
}

/**
 * List products with optional pagination and tag filtering.
 * options: { offset, limit, tag }
 */
async function list (options = {}) {
  const { offset = 0, limit = 25, tag } = options

  let products = await readProducts()

  // Filter by tag if provided
  if (tag) {
    products = products.filter(p =>
      Array.isArray(p.tags) && p.tags.includes(tag)
    )
  }

  // Pagination
  const start = Number(offset) || 0
  const end = start + (Number(limit) || products.length)

  return products.slice(start, end)
}

/**
 * Get a single product by id.
 */
async function get (id) {
  const products = await readProducts()
  return products.find(p => p.id === id) || null
}

module.exports = {
  list,
  get
}
