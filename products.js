const fs = require('fs').promises;
const path = require('path');
const productsFile = path.join(__dirname, 'data/full-products.json');

module.exports = {
  list,
  get,
  create,
  update,
  remove
};

// List with optional pagination/tag
async function list(options = {}) {
  const { offset = 0, limit = 25, tag } = options;
  let products = JSON.parse(await fs.readFile(productsFile));
  if (tag) products = products.filter(p => p.tags.includes(tag));
  return products.slice(offset, offset + limit);
}

// Get single product by ID
async function get(id) {
  const products = JSON.parse(await fs.readFile(productsFile));
  return products.find(p => p.id === id) || null;
}

// Create product
async function create(product) {
  const products = JSON.parse(await fs.readFile(productsFile));
  products.push(product);
  await fs.writeFile(productsFile, JSON.stringify(products, null, 2));
  return product;
}

// Update product
async function update(id, data) {
  const products = JSON.parse(await fs.readFile(productsFile));
  const index = products.findIndex(p => p.id === id);
  if (index === -1) return null;
  products[index] = { ...products[index], ...data };
  await fs.writeFile(productsFile, JSON.stringify(products, null, 2));
  return products[index];
}

// Delete product
async function remove(id) {
  let products = JSON.parse(await fs.readFile(productsFile));
  products = products.filter(p => p.id !== id);
  await fs.writeFile(productsFile, JSON.stringify(products, null, 2));
}
