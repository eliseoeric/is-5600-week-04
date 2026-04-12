// products.js
const fs = require('fs').promises
const path = require('path')

const productsFile = path.join(__dirname, 'data/full-products.json')

module.exports = {
  list,
  get,
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

  if (tag) {
    products = products.filter(product => product.tags && product.tags.includes(tag))
  }

  return products.slice(offset, offset + limit) // Slice the products
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
  return null;
}

/**
 * Update a product
 * @param {string} id
 * @param {object} data
 */
async function update (id, data) {
  console.log(`Product ${id} updated with`, data)
}

/**
 * Delete a product
 * @param {string} id
 */
async function deleteProduct (id) {
  console.log(`Product ${id} deleted`)
}