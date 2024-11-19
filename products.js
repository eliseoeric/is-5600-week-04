const fs = require('fs').promises
const path = require('path')

const productsFile = path.join(__dirname, 'data', 'full-products.json')

/**
 * Delete a product by ID
 * @param {string|number} id - Product ID to delete
 * @returns {boolean} - Whether the product was deleted (simulation)
 */
async function deleteProduct(id) {
  // Simulate the deletion process
  console.log(`Product with ID ${id} deleted.`)  // Log a message
  return true;  // Return true to simulate success
}

/**
 * Update a product by ID
 * @param {string|number} id - Product ID to update
 * @param {Object} updatedProduct - The updated product data
 * @returns {Object|null} - The updated product (simulation)
 */
async function updateProduct(id, updatedProduct) {
  // Simulate the update process
  console.log(`Product with ID ${id} updated with data:`, updatedProduct)  // Log the updated data
  return updatedProduct;  // Return the updated product as a simulation
}

module.exports = {
  list,
  get,
  deleteProduct,
  updateProduct
}
