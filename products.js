const fs = require('fs').promises;
const path = require('path');

const productsFile = path.join(__dirname, 'data/full-products.json');

// List all products with optional pagination and filtering
async function list(options = {}) {
  const { offset = 0, limit = 25, tag } = options;
  const data = await fs.readFile(productsFile);
  let products = JSON.parse(data);

  if (tag) {
    products = products.filter(product => product.tags.includes(tag));
  }

  return products.slice(offset, offset + limit);  // Slice products based on offset and limit
}

// Fetch a single product by id
async function get(id) {
  const products = JSON.parse(await fs.readFile(productsFile));
  return products.find(product => product.id === id) || null;
}

module.exports = {
  list,
  get,
};
