// products.js
const fs = require('fs').promises;
const path = require('path');

const productsFile = path.join(__dirname, 'data/full-products.json');

/**
 * List products with optional offset/limit/tag filter
 * @param {object} options
 * @param {number} options.offset
 * @param {number} options.limit
 * @param {string} options.tag
 */
async function list(options = {}) {
  const { offset = 0, limit = 25, tag } = options;

  const data = await fs.readFile(productsFile);
  let products = JSON.parse(data);

  // IMPORTANT: tags are objects like { title: 'texture' }
  if (tag) {
    const target = String(tag).toLowerCase();
    products = products.filter(p =>
      Array.isArray(p.tags) &&
      p.tags.some(t => (t.title || '').toLowerCase() === target)
    );
  }

  // pagination
  return products.slice(offset, offset + limit);
}

/**
 * Get a single product by id
 */
async function get(id) {
  const data = await fs.readFile(productsFile);
  const products = JSON.parse(data);
  return products.find(p => p.id === id) || null;
}

/**
 * Fake create – just log for the lab
 */
async function create(product) {
  console.log('Create product (not persisted):', product);
  return product;
}

/**
 * Fake update – just log for the lab
 */
async function update(id, updates) {
  console.log('Update product (not persisted):', id, updates);
  return { id, ...updates };
}

/**
 * Fake delete – just log for the lab
 */
async function remove(id) {
  console.log('Delete product (not persisted):', id);
}

module.exports = {
  list,
  get,
  create,
  update,
  remove
};