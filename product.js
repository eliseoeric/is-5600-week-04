// products.js
const fs = require('fs').promises;
const path = require('path');
const { randomUUID } = require('crypto');

const productsFile = path.join(__dirname, 'data', 'full-products.json');

module.exports = {
  list,
  get,
  create,
  update,
  remove
};

/**
 * List products with optional offset, limit and tag.
 * @param {object} options
 */
async function list(options = {}) {
  const { offset = 0, limit = 25, tag } = options;
  const raw = await fs.readFile(productsFile, 'utf8');
  let products = JSON.parse(raw);

  if (tag) {
    products = products.filter(p => Array.isArray(p.tags) ? p.tags.includes(tag) : false);
  }

  const total = products.length;
  const sliced = products.slice(Number(offset), Number(offset) + Number(limit));
  return { total, products: sliced };
}

/**
 * Get a product by id
 */
async function get(id) {
  const raw = await fs.readFile(productsFile, 'utf8');
  const products = JSON.parse(raw);
  return products.find(p => p.id === id) || null;
}

/**
 * Create a new product (persists to file)
 */
async function create(productData) {
  const raw = await fs.readFile(productsFile, 'utf8');
  const products = JSON.parse(raw);
  const newProduct = {
    id: randomUUID(),
    ...productData
  };
  products.push(newProduct);
  await fs.writeFile(productsFile, JSON.stringify(products, null, 2), 'utf8');
  console.log('Product created:', newProduct.id);
  return newProduct;
}

/**
 * Update an existing product by id (persists to file)
 */
async function update(id, updates) {
  const raw = await fs.readFile(productsFile, 'utf8');
  const products = JSON.parse(raw);
  const idx = products.findIndex(p => p.id === id);
  if (idx === -1) return null;
  products[idx] = { ...products[idx], ...updates };
  await fs.writeFile(productsFile, JSON.stringify(products, null, 2), 'utf8');
  console.log('Product updated:', id);
  return products[idx];
}

/**
 * Remove a product by id (persists to file)
 */
async function remove(id) {
  const raw = await fs.readFile(productsFile, 'utf8');
  let products = JSON.parse(raw);
  const before = products.length;
  products = products.filter(p => p.id !== id);
  if (products.length === before) return false; // not found
  await fs.writeFile(productsFile, JSON.stringify(products, null, 2), 'utf8');
  console.log('Product deleted:', id);
  return true;
}
