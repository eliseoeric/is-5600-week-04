// products.js
const fs = require('fs').promises
const path = require('path')

// Path to the products data file
const productsFile = path.join(__dirname, 'data/products.json')

/**
 * List products with pagination and filtering by tag
 * @param {object} options
 * @returns {Promise<Array>}
 */
async function list (options = {}) {
  const { offset = 0, limit = 25, tag } = options
  const data = await fs.readFile(productsFile)
  const products = JSON.parse(data)

  let filteredProducts = products

  if (tag) {
    filteredProducts = products.filter(product => product.tags.includes(tag))
  }

  return filteredProducts.slice(offset, offset + limit) // Paginate the results
}

/**
 * Get a single product by ID
 * @param {string} id
 * @returns {Promise<object>}
 */
async function get (id) {
  const products = JSON.parse(await fs.readFile(productsFile))
  return products.find(product => product.id === id) || null // Return the product or null if not found
}

module.exports = {
  list,
  get
}