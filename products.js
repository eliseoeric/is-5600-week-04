const fs = require('fs').promises;
const path = require('path');

const productsFile = path.join(__dirname, 'data/full-products.json');

/**
 * List products with optional filtering and pagination
 * @param {object} options - Query options
 * @param {number} options.offset - Pagination offset
 * @param {number} options.limit - Pagination limit
 * @param {string} options.tag - Optional tag for filtering
 * @returns {Promise<Array>} List of products
 */
async function list(options = {}) {
  const { offset = 0, limit = 25, tag } = options;

  try {
    const data = await fs.readFile(productsFile, 'utf-8');
    const products = JSON.parse(data);

    return products
      .filter(product => {
        if (!tag) return true;
        return product.tags.some(({ title }) => title === tag);
      })
      .slice(Number(offset), Number(offset) + Number(limit));
  } catch (err) {
    console.error('Error reading or parsing products file:', err);
    throw new Error('Could not list products');
  }
}

/**
 * Get a single product by ID
 * @param {string} id - Product ID
 * @returns {Promise<Object|null>} The product or null if not found
 */
async function get(id) {
  try {
    const data = await fs.readFile(productsFile, 'utf-8');
    const products = JSON.parse(data);

    return products.find(product => product.id === id) || null;
  } catch (err) {
    console.error('Error reading or parsing products file:', err);
    throw new Error('Could not retrieve product');
  }
}

/**
 * Simulate deleting a product by ID
 * @param {string} id - Product ID
 * @returns {Promise<boolean>} Confirmation of deletion
 */
async function deleteProduct(id) {
  console.log(`Product with ID ${id} has been deleted.`);
  return true; // Simulate successful deletion
}

/**
 * Simulate updating a product by ID
 * @param {string} id - Product ID
 * @param {object} updatedData - Updated product data
 * @returns {Promise<boolean>} Confirmation of update
 */
async function updateProduct(id, updatedData) {
  console.log(`Product with ID ${id} has been updated with data:`, updatedData);
  return true; // Simulate successful update
}

module.exports = {
  list,
  get,
  delete: deleteProduct,
  update: updateProduct,
};
