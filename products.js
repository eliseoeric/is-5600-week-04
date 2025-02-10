// products.js
const fs = require('fs').promises
const path = require('path')

const productsFile = path.join(__dirname, 'data/full-products.json')

module.exports = {
  list,
  get,
  deleteP,
  updateP
}


/**
 * List all products
 * @returns {Promise<Array>}
 */
async function list(options = {}) {
  const { offset = 0, limit = 25, tag } = options;
  const data = await fs.readFile(productsFile);
  let products = JSON.parse(data);

  if (tag) {
    products = products.filter(product => 
      Array.isArray(product.tags) && 
      product.tags.some(t => t.title.toLowerCase() === tag.toLowerCase())
    );
  }

  return products.slice(offset, offset + limit);
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
 * Delete a product (Mock Implementation)
 * @param {string} id
 * @returns {Promise<boolean>}
 */
async function deleteP(id) {
  console.log(`Product with ID ${id} deleted.`); 
  return true;
}

/**
 * Update a product (Mock Implementation)
 * @param {string} id
 * @param {object} updatedData
 * @returns {Promise<boolean>}
 */
async function updateP(id, updatedData) {
  console.log(`Product with ID ${id} updated.`, updatedData); 
  return true;
}