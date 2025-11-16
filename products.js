const fs = require("fs").promises;
const path = require("path");

const productsFile = path.join(__dirname, "data/full-products.json");

/**
 * List all products with optional tag filtering and pagination
 * @param {object} options
 * @param {number} options.offset - Pagination offset
 * @param {number} options.limit - Pagination limit
 * @param {string} [options.tag] - Optional tag filter
 * @returns {Promise<Array>}
 */
async function list(options = {}) {
  const { offset = 0, limit = 25, tag } = options;

  const data = await fs.readFile(productsFile);
  return JSON.parse(data)
    .filter((product) => {
      // If no tag is provided, return all products
      if (!tag) return true;

      // Check if product has a matching tag
      return Array.isArray(product.tags) &&
             product.tags.find(({ title }) => title === tag);
    })
    .slice(offset, offset + limit); // Return paginated result
}

/**
 * Get a single product by its ID
 * @param {string} id - Product ID
 * @returns {Promise<object|null>} - The product or null if not found
 */
async function get(id) {
  const products = JSON.parse(await fs.readFile(productsFile));
  const product = products.find((p) => p.id === id);
  return product || null;
}

module.exports = {
  list,
  get,
};