// products.js

const fs = require('fs').promises;
const path = require('path');

const productsFile = path.join(__dirname, 'data/full-products.json');

module.exports = {
  list,
  get,
  update,
  remove,
};

/**
 * List all products
 * @param {object} options
 * @param {number} options.offset
 * @param {number} options.limit
 * @param {string} options.tag
 * @returns {Promise<Array>}
 */
async function list(options = {}) {
  const { offset = 0, limit = 25, tag } = options;
  const data = await fs.readFile(productsFile);
  const products = JSON.parse(data);

  // If tag is provided, filter the products by the title of the tags
  if (tag) {
    return products.filter(product =>
      product.tags && product.tags.some(t => t.title && t.title.toLowerCase() === tag.toLowerCase())
    );
  }

  // Slice the products and return based on offset and limit
  return products.slice(offset, offset + limit);
}

/**
 * Get a single product
 * @param {string} id
 * @returns {Promise<object>}
 */
async function get(id) {
  const products = JSON.parse(await fs.readFile(productsFile));
  return products.find(product => product.id === id) || null;
}

/**
 * Update a product
 * @param {string} id
 * @param {object} updatedProduct
 * @returns {Promise<object>}
 */
async function update(id, updatedProduct) {
  console.log(`Updating product with ID: ${id}`);
  // Simulate updating the product (not implemented here)
  return { ...updatedProduct, id };
}

/**
 * Delete a product
 * @param {string} id
 * @returns {Promise<void>}
 */
async function remove(id) {
  console.log(`Deleting product with ID: ${id}`);
  // Simulate deleting the product (not implemented here)
  return;
}
