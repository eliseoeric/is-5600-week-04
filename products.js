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
 * @returns {Promise<Array>}
 */
async function list (options = {}) {
    const { offset = 0, limit = 25 } = options
    const data = await fs.readFile(productsFile)
  
    return JSON.parse(data).slice(offset, offset + limit) // Slice the products
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
 * Create a new product
 * @param {object} newProduct
 * @returns {Promise<object>}
 */
async function create(newProduct) {
    const products = JSON.parse(await fs.readFile(productsFile))
  
    newProduct.id = Math.random().toString(36).substr(2, 9) // Generate random ID
    products.push(newProduct)
  
    await fs.writeFile(productsFile, JSON.stringify(products, null, 2))
  
    return newProduct
  }
  
  /**
   * Update a product (Placeholder)
   * @param {string} id
   * @param {object} updates
   * @returns {Promise<object>}
   */
  async function update(id, updates) {
    console.log(`Product ${id} updated with:`, updates) // ✅ Logs update action
    return { id, ...updates } // ✅ Returns the updated product (not saved)
  }
  
  /**
   * Delete a product (Placeholder)
   * @param {string} id
   * @returns {Promise<void>}
   */
  async function remove(id) {
    console.log(`Product ${id} deleted`) // ✅ Logs deletion action
  }
  