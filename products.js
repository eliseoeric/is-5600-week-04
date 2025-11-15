// products.js
const fs = require('fs').promises
const path = require('path')

const productsFile = path.join(__dirname, 'data/full-products.json')

module.exports = {
  list,
  get,
  // optional: create if you want
  create,
  update,
  delete: deleteProduct
}

/**
 * List all products
 * @returns {Promise<Array>}
 */
async function list (options = {}) {
  const { offset = 0, limit = 25, tag } = options
  const data = await fs.readFile(productsFile)
  let products = JSON.parse(data)

  // filter by tag if provided
  if (tag) {
    products = products.filter(p => Array.isArray(p.tags) ? p.tags.includes(tag) : (p.tag === tag))
  }

  // return the slice for pagination
  const sliced = products.slice(offset, offset + limit)

  // If you want to return total count (lab mentioned that), return object:
  // return { total: products.length, products: sliced }
  // but since earlier code returned array, keep it consistent with your frontend expectations:
  return sliced
}

/**
 * Get a single product by id
 */
async function get (id) {
  const products = JSON.parse(await fs.readFile(productsFile))
  for (let i = 0; i < products.length; i++) {
    if (products[i].id === id) return products[i]
  }
  return null
}

/**
 * Create a new product (optional simple placeholder)
 */
async function create (product) {
  // For the lab you may keep this as a placeholder that logs and returns the product
  console.log('Products.create called with:', product)
  return product
}

/**
 * Update a product (placeholder)
 * Logs the id and updates and returns a simple object or true.
 */
async function update (id, updates) {
  console.log(`Products.update called for id=${id} with`, updates)
  // Not actually writing to file; return a simple merged object
  return {
    id,
    ...updates
  }
}

/**
 * Delete a product (placeholder)
 * Logs the id and returns true
 */
async function deleteProduct (id) {
  console.log(`Products.delete called for id=${id}`)
  // Not actually removing from file
  return true
}
