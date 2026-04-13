// products.js
const fs = require('fs').promises
const path = require('path')

const productsFile = path.join(__dirname, 'data/full-products.json')

module.exports = {
  list,
  get,
  create,
  update,
  remove
}

/**
 * List all products
 * @param {object} options
 * @returns {Promise<Array>}
 */
async function list (options = {}) {
  const { offset = 0, limit = 25, tag } = options
  const data = await fs.readFile(productsFile)
  let products = JSON.parse(data)

  // Filter by tag if provided
  if (tag) {
    products = products.filter(product => 
  Array.isArray(product.tags) && product.tags.some(t => t.title === tag))
  }

  return products.slice(offset, offset + limit)
}

/**
 * Get a single product
 * @param {string} id
 * @returns {Promise<object>}
 */
async function get (id) {
  const products = JSON.parse(await fs.readFile(productsFile))

  for (let i = 0; i < products.length; i++) {
    if (products[i].id === id) {
      return products[i]
    }
  }

  return null
}

/**
 * Create a new product
 * @param {object} data
 * @returns {Promise<object>}
 */
async function create (data) {
  console.log('create product:', data)
  return data
}

/**
 * Update a product
 * @param {string} id
 * @param {object} data
 * @returns {Promise<object>}
 */
async function update (id, data) {
  console.log('update product:', id, data)
  return { id, ...data }
}

/**
 * Delete a product
 * @param {string} id
 * @returns {Promise<object>}
 */
async function remove (id) {
  console.log('delete product:', id)
  return { deleted: true }
}