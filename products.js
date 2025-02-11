const fs = require('fs').promises
const path = require('path')

const productsFile = path.join(__dirname, 'data/full-products.json')

module.exports = {
  list,
  get,
  deleteProduct,  // ✅ Added DELETE method
  updateProduct   // ✅ Added PUT method
}

/**
 * List all products with optional pagination and filtering by tag
 * @param {object} options - Pagination (limit, offset) & filtering (tag)
 * @returns {Promise<object>} - An object containing filtered products and total count
 */
async function list(options = {}) {
  const { offset = 0, limit = 25, tag } = options
  const data = await fs.readFile(productsFile)
  let products = JSON.parse(data)

  // Filter products by tag if tag is provided
  if (tag) {
    products = products.filter(product => product.tags && product.tags.includes(tag))
  }

  return {
    total: products.length,
    products: products.slice(offset, offset + limit) // Apply pagination
  }
}

/**
 * Get a single product by ID
 * @param {string} id
 * @returns {Promise<object|null>}
 */
async function get(id) {
  const products = JSON.parse(await fs.readFile(productsFile))

  // Find product with matching id
  return products.find(product => product.id === id) || null
}

/**
 * DELETE a product by ID (Placeholder)
 * @param {string} id
 */
async function deleteProduct(id) {
  console.log(`Product with ID ${id} deleted`)  // Log the action
  return { message: `Product with ID ${id} deleted` }
}

/**
 * UPDATE a product by ID (Placeholder)
 * @param {string} id
 */
async function updateProduct(id, updatedData) {
  console.log(`Product with ID ${id} updated with data:`, updatedData)  // Log the action
  return { message: `Product with ID ${id} updated` }
}
