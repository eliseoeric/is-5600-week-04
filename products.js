const fs = require('fs').promises;
const path = require('path');

const productsFile = path.join(__dirname, '/data/full-products.json');

module.exports = {
  list,
  get,
  create
};

/**
 * List products with optional filtering and pagination
 * @param {object} options - Pagination and filtering options
 * @param {number} options.offset - Starting index
 * @param {number} options.limit - Number of items to return
 * @param {string} options.tag - Filter products by tag
 * @returns {Promise<Array>} - A list of filtered products
 */
async function list(options = {}) {
  const { offset = 0, limit = 25, tag } = options;

  const data = await fs.readFile(productsFile, 'utf-8');
  let products = JSON.parse(data);

  if (tag) {
    products = products.filter(product => product.tags.includes(tag));
  }

  return products.slice(offset, offset + limit);
}

/**
 * Get a single product by ID
 * @param {string} id
 * @returns {Promise<object|null>}
 */
async function get(id) {
  const data = await fs.readFile(productsFile, 'utf-8');
  const products = JSON.parse(data);

  return products.find(product => product.id === id) || null;
}

/**
 * Create or update a product
 * @param {object} productData - The new product data
 * @returns {Promise<object>}
 */
async function create(productData) {
  const data = await fs.readFile(productsFile, 'utf-8');
  let products = JSON.parse(data);

  // Check if product exists (update case)
  const existingIndex = products.findIndex(p => p.id === productData.id);
  if (existingIndex !== -1) {
    products[existingIndex] = productData; // Update existing product
  } else {
    products.push(productData); // Add new product
  }

  await fs.writeFile(productsFile, JSON.stringify(products, null, 2), 'utf-8');
  return productData;
}