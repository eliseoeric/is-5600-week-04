// products.js

const fs = require('fs').promises
const path = require('path')

const productsFile = path.join(__dirname, 'data/full-products.json')

/**
 * List products with pagination + optional tag filter
 */
async function list(options = {}) {
  const { offset = 0, limit = 25, tag } = options
  const data = await fs.readFile(productsFile)
  let products = JSON.parse(data)

  if (tag) {
    products = products.filter(p => p.tags && p.tags.includes(tag))
  }

  return products.slice(offset, offset + limit)
}

/**
 * Get product by ID
 */
async function get(id) {
  const products = JSON.parse(await fs.readFile(productsFile))

  for (let p of products) {
    if (p.id === id) return p
  }

  return null
}

/**
 * Placeholder delete function per README
 */
async function remove(id) {
  console.log('DELETE requested for id:', id)
  return true
}

/**
 * Placeholder update function per README
 */
async function update(id, body) {
  console.log('UPDATE requested for id:', id, 'with:', body)
  return true
}

module.exports = {
  list,
  get,
  remove,
  update
}
