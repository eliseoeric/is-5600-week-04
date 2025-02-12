const fs = require('fs').promises
const path = require('path')

const productsFile = path.join(__dirname, 'data/full-products.json')

module.exports = {
  list,
  deleteProduct,
  get,
  updateProduct
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
  async function deleteProduct (id) {
    console.log(`Product with ID ${id} deleted`);
    return { message: `Product with ID ${id} deleted` };
  }
  
  /**
   * Update a product (Mock)
   * @param {string} id
   * @param {object} data
   * @returns {Promise<object>}
   */
  async function updateProduct (id, data) {
    console.log(`Product with ID ${id} updated with data:`, data);
    return { message: `Product with ID ${id} updated`, data };
  }