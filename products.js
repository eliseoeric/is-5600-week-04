const fs = require('fs').promises
const path = require('path')

const productsFile = path.join(__dirname, 'data/full-products.json')

module.exports = {
  list,
  get,
  remove,
  update
}

/**
 * List all products with pagination and tag filter
 */
async function list(options = {}) {
  const { offset = 0, limit = 25, tag } = options
  const data = JSON.parse(await fs.readFile(productsFile))

  let result = data

  if (tag) {
    result = result.filter(p => p.tags && p.tags.includes(tag))
  }

  return result.slice(offset, offset + limit)
}

/**
 * Get one product by ID
 */
async function get(id) {
  const products = JSON.parse(await fs.readFile(productsFile))

  return products.find(p => p.id === id) || null
}

/**
 * Fake delete (lab requirement)
 */
async function remove(id) {
  console.log("(products.js) Pretend delete:", id)
  return true
}

/**
 * Fake update (lab requirement)
 */
async function update(id, data) {
  console.log("(products.js) Pretend update:", id, data)
  return { id, ...data }
}


