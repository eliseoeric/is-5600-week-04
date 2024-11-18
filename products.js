const fs = require('fs').promises;
const path = require('path');
const productsFile = path.join(__dirname, 'data/full-products.json');

// List all products with pagination and filtering support
async function list(options = {}) {
  const { offset = 0, limit = 25, tag } = options;
  const data = await fs.readFile(productsFile);
  const products = JSON.parse(data);

  let filteredProducts = products;
  if (tag) {
    filteredProducts = products.filter(product => product.tags.includes(tag));
  }

  return filteredProducts.slice(offset, offset + limit);
}

// Get a single product by ID
async function get(id) {
  const products = JSON.parse(await fs.readFile(productsFile));
  return products.find(product => product.id === id) || null;
}

module.exports = {
  list,
  get
};

