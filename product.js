// products.js
const fs = require('fs').promises
const path = require('path')

const productsFile = path.join(__dirname, 'data', 'full-products.json')

module.exports = {
  list,
  get,
  create,
  update,
  remove
}

/**
 * List products with optional pagination and tag filter
 * @param {object} options { offset, limit, tag }
 * @returns {Promise<{ items: Array, total: number }>}
 */
async function list (options = {}) {
  const { offset = 0, limit = 25, tag } = options
  const raw = await fs.readFile(productsFile, 'utf8')
  let products = JSON.parse(raw)

  // Apply tag filter if provided
  if (tag) {
    const t = String(tag).toLowerCase()
    products = products.filter(p => Array.isArray(p.tags) ? p.tags.map(x => String(x).toLowerCase()).includes(t) : false)
  }

  const total = products.length
  const items = products.slice(offset, offset + limit)

  return { items, total }
}

/**
 * Get a product by id
 */
async function get (id) {
  const raw = await fs.readFile(productsFile, 'utf8')
  const products = JSON.parse(raw)
  return products.find(p => p.id === id) || null
}

/**
 * Create a product - placeholder: logs and returns the supplied body with a fake id
 */
async function create (payload = {}) {
  // In a real app you'd write to the file or DB. For lab, log and return.
  const fakeId = `prod_${Date.now()}`
  const product = Object.assign({ id: fakeId }, payload)
  console.log('Products.create called - would create:', product)
  // Optionally you could append to file, but lab doesn't require persistence.
  return product
}

/**
 * Update a product - placeholder: logs and returns updated object
 */
async function update (id, payload = {}) {
  console.log(`Products.update called for id=${id} payload=`, payload)
  // Return an object representing the update result
  return { id, ...payload }
}

/**
 * Remove a product - placeholder: logs and returns true
 */
async function remove (id) {
  console.log(`Products.remove called for id=${id}`)
  // Return some acknowledgment; actual deletion not required
  return true
}
