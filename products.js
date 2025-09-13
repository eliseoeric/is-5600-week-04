const fs = require('fs').promises;
const path = require('path');

const productsFile = path.join(__dirname, 'data/full-products.json');

/**
 * List products with pagination and filtering
 */
async function list(options = {}) {
  const { offset = 0, limit = 25, tag } = options;
  const data = JSON.parse(await fs.readFile(productsFile));

  let results = data;

  if (tag) {
    results = results.filter(p =>
      (p.tags || []).includes(tag.toLowerCase())
    );
  }

  return results.slice(offset, offset + limit);
}

/**
 * Get product by id
 */
async function get(id) {
  const products = JSON.parse(await fs.readFile(productsFile));
  return products.find(p => p.id === id) || null;
}

module.exports = {
  list,
  get
};
