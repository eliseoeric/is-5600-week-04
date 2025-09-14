const fs = require('fs').promises
const path = require('path')

const productsFile = path.join(__dirname, 'data/products.json')

module.exports = {
  list,
  get,
  update,   // <-- add
  remove    // <-- add
}

/**
 * List all products
 * @returns {Promise<Array>}
 */
async function list (options = {}) {
  const { offset = 0, limit = 25, tag } = options
  const data = await fs.readFile(productsFile)
  let items = JSON.parse(data)
  if (tag) {
    items = items.filter(p => Array.isArray(p.tags) && p.tags.includes(tag))
  }
  return items.slice(offset, offset + limit)
}

/**
 * Get a single product
 * @param {string} id
 * @returns {Promise<object|null>}
 */
async function get (id) {
  const products = JSON.parse(await fs.readFile(productsFile))
  for (let i = 0; i < products.length; i++) {
    if (products[i].id === id) return products[i]
  }
  return null
}

/**
 * Update a product (stub)
 * @param {string} id
 * @param {object} attrs
 * @returns {Promise<object>}
 */
async function update (id, attrs = {}) {
  console.log(`UPDATE product ${id}`, attrs)
  return { id, ...attrs }
}

/**
 * Delete a product (stub)
 * @param {string} id
 * @returns {Promise<boolean>}
 */
async function remove (id) {
  console.log(`DELETE product ${id}`)
  return true
}
