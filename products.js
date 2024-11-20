const fs = require('fs').promises;
const path = require('path');

const productsFile = path.join(__dirname, 'data/full-products.json');

/**
 * List products with optional filtering and pagination
 * @param {object} options
 * @returns {Promise<Array>}
 */
async function list({ limit, offset, tag } = {}) {
  const data = await fs.readFile(productsFile, 'utf-8');
  let products = JSON.parse(data);

  // Filter by tag if provided
  if (tag) {
    products = products.filter(product => product.tags.includes(tag));
  }

  // Paginate results
  return products.slice(offset, offset + limit);
}

/**
 * Get a single product by ID
 * @param {string} id
 * @returns {Promise<object | null>}
 */
async function get(id) {
  const data = await fs.readFile(productsFile, 'utf-8');
  const products = JSON.parse(data);
  return products.find(product => product.id === id) || null;
}

module.exports = {
  list,
  get,
};