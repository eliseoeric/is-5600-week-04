// products.js
const fs = require('fs').promises
const path = require('path')

const productsFile = path.join(__dirname, 'data/full-products.json')

module.exports = {
  list
}


/**
 * List all products
 * @returns {Promise<Array>}
 */
async function list () {
  const data = await fs.readFile(productsFile)
  return JSON.parse(data)
}
// products.js

/**
 * List all products
 * @returns {Promise<Array>}
 */
async function list (options = {}) {
    const { offset = 0, limit = 25 } = options
    const data = await fs.readFile(productsFile)
  
    return JSON.parse(data).slice(offset, offset + limit) // Slice the products
  }
  // products.js

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
  const fs = require('fs').promises;
const path = require('path');

const productsFile = path.join(__dirname, 'data/full-products.json');

module.exports = {
  list,
  get,
  deleteProduct,
  updateProduct
};

/**
 * List all products
 * @param {Object} options - Options for pagination
 * @returns {Promise<Array>}
 */
async function list(options = {}) {
  const { offset = 0, limit = 25 } = options;
  const data = await fs.readFile(productsFile);
  return JSON.parse(data).slice(offset, offset + limit); // Slice the products
}

/**
 * Get a single product by ID
 * @param {string} id
 * @returns {Promise<Object|null>}
 */
async function get(id) {
  const products = JSON.parse(await fs.readFile(productsFile));

  // Loop through the products and return the product with the matching id
  for (let i = 0; i < products.length; i++) {
    if (products[i].id === id) {
      return products[i];
    }
  }

  // If no product is found, return null
  return null;
}

/**
 * Delete a product (simulated)
 * @param {string} id
 * @returns {Promise<string>}
 */
async function deleteProduct(id) {
  console.log(`Product with ID ${id} was deleted.`);
  return { message: `Product with ID ${id} has been deleted.` };
}

/**
 * Update a product (simulated)
 * @param {string} id
 * @param {Object} updatedData
 * @returns {Promise<string>}
 */
async function updateProduct(id, updatedData) {
  console.log(`Product with ID ${id} was updated with data:`, updatedData);
  return { message: `Product with ID ${id} has been updated.` };
}
