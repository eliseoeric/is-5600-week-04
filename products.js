// products.js
const fs = require('fs').promises
const path = require('path')

const productsFile = path.join(__dirname, 'data/full-products.json')

/**
 * List all products
 * @returns {Promise<Array>}
 */
async function list (options = {}) {
  const { offset = 0, limit = 25, tag } = options
  const data = await fs.readFile(productsFile)
  let products = JSON.parse(data)
  
  // Filter by tag if provided
  if (tag) {
    products = products.filter(product => product.tags && product.tags.includes(tag))
  }
  
  // Return sliced products based on offset and limit
  return products.slice(offset, offset + limit)
}

/**
 * Get a single product
 * @param {string} id
 * @returns {Promise<object>}
 */
async function get (id) {
  const products = JSON.parse(await fs.readFile(productsFile))

  // Loop through the products and return the product with the matching id
  for (let i = 0; i < products.length; i++) {
    if (products[i].id === id) {
      return products[i]
    }
  }

  // If no product is found, return null
  return null
}

module.exports = {
  list,
  get
}