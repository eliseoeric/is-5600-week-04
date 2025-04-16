// products.js
const fs = require('fs').promises
const path = require('path')

const productsFile = path.join(__dirname, 'data/full-products.json')

module.exports = {
  list,
  get
}

/**
 * List all products
 * @returns {Promise<Array>}
 */

async function list(options = {}) {
  const { offset = 0, limit = 25 } = options
  try {
    const data = await fs.readFile(productsFile)
    return JSON.parse(data).slice(offset, offset + limit)
  } catch (err) {
    return []
  }
}

/**
 * Get a single product
 * @param {string} id
 * @returns {Promise<object>}
 */
async function get(id) {
  const products = JSON.parse(await fs.readFile(productsFile))
  for (let i = 0; i < products.length; i++) {
    if (products[i]._id === id) {
      return products[i]
    }
  }
  return null
}

module.exports = {
  list,
  get
}