
const fs = require('fs').promises;
const path = require('path');

const productsFile = path.join(
  __dirname,
  'data',
  'full-products.json'
);

module.exports = {
  list,
  get,
  deleteProduct,
  updateProduct
};

// List products with filtering and pagination
async function list(options = {}) {
  const {
    offset = 0,
    limit = 25,
    tag
  } = options;

  const data = await fs.readFile(productsFile, 'utf8');
  let products = JSON.parse(data);

  // Filter products by tag
  if (tag) {
    products = products.filter(product =>
      product.tags.some(item => item.title === tag)
    );
  }

  const total = products.length;

  return {
    products: products.slice(offset, offset + limit),
    total
  };
}

// Get a single product
async function get(id) {
  const data = await fs.readFile(productsFile, 'utf8');
  const products = JSON.parse(data);

  return products.find(product => product.id === id) || null;
}

// Delete product (placeholder as instructed)
async function deleteProduct(id) {
  console.log(`Product ${id} was deleted`);
}

// Update product (placeholder as instructed)
async function updateProduct(id, product) {
  console.log(`Product ${id} was updated`, product);
}
