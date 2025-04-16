const fs = require('fs').promises
const path = require('path')

const productsFile = path.join(__dirname, 'data/full-products.json')

/**
 * List all products
 * @param {object} options
 * @returns {Promise<Array>}
 */
async function list(options = {}) {
  const { offset = 0, limit = 25, tag } = options
  const data = await fs.readFile(productsFile)
  let products = JSON.parse(data)
  
  // Filter by tag if provided
  if (tag) {
    products = products.filter(product => {
      return product.tags.some(t => t.title.toLowerCase() === tag.toLowerCase())
    })
  }
  
  // Apply offset and limit
  return products.slice(offset, offset + limit)
}

/**
 * Get a single product
 * @param {string} id
 * @returns {Promise<object>}
 */
async function get(id) {
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

/**
 * Update a product
 * @param {string} id
 * @param {object} updateData
 * @returns {Promise<void>}
 */
async function update(id, updateData) {
  // This is a placeholder for a real update operation
  // In a real application, we would update the products file
  console.log(`Updating product with id: ${id}`)
  console.log('Update data:', updateData)
  return
}

/**
 * Delete a product
 * @param {string} id
 * @returns {Promise<void>}
 */
async function deleteProduct(id) {
  // This is a placeholder for a real delete operation
  // In a real application, we would update the products file
  console.log(`Deleting product with id: ${id}`)
  return
}

module.exports = {
  list,
  get,
  update,
  delete: deleteProduct // Using deleteProduct to avoid conflict with reserved keyword
}