const fs = require('fs').promises;
const path = require('path');

const productsFile = path.join(__dirname, 'data/full-products.json');

/**
 * List products with optional filtering and pagination
 * @param {object} options
 * @param {number} options.limit - Number of products to return (default: 10)
 * @param {number} options.offset - Number of products to skip (default: 0)
 * @param {string} options.tag - Filter products by tag
 * @returns {Promise<Array>}
 */
async function list({ limit = 10, offset = 0, tag } = {}) {
  try {
    const data = await fs.readFile(productsFile, 'utf-8');
    let products = JSON.parse(data);

    // Filter by tag if provided
    if (tag) {
      products = products.filter(product => product.tags?.includes(tag));
    }

    // Paginate results
    return products.slice(offset, offset + limit);
  } catch (error) {
    console.error("Error reading product file:", error);
    throw new Error("Could not retrieve products");
  }
}

/**
 * Get a single product by ID
 * @param {string} id
 * @returns {Promise<object | null>}
 */
async function get(id) {
  try {
    const data = await fs.readFile(productsFile, 'utf-8');
    const products = JSON.parse(data);

    // Convert ID to number to match JSON data
    return products.find(product => product.id === Number(id)) || null;
  } catch (error) {
    console.error("Error retrieving product:", error);
    throw new Error("Could not retrieve product");
  }
}

module.exports = {
  list,
  get,
};
