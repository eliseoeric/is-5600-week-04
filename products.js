const fs = require('fs').promises;
const path = require('path');

const productsFile = path.join(__dirname, 'data/full-products.json');

/**
 * Get a single product by ID
 */
async function get(id) {
  const products = JSON.parse(await fs.readFile(productsFile));
  return products.find((product) => product.id === id) || null;
}

/**
 * List all products
 */
async function list(options = {}) {
  const { offset = 0, limit = 25, tag } = options;
  const data = await fs.readFile(productsFile);

  return JSON.parse(data)
    .filter((product) => !tag || product.tags.some(({ title }) => title === tag))
    .slice(offset, offset + limit);
}

/**
 * Update a product (stub function for now)
 */
async function update(id, updates) {
  // Logging as a stub
  console.log(`Pretend we're updating product with ID ${id}:`, updates);
  return { id, ...updates };
}

/**
 * Delete a product (stub function for now)
 */
async function remove(id) {
  // Logging as a stub
  console.log(`Pretend we're deleting product with ID ${id}`);
  return true;
}

module.exports = {
  list,
  get,
  update, // Add the update method
  remove, // Add the delete method
};
