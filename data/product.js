// products.js
const fs = require('fs').promises;
const path = require('path');

const productsFile = path.join(__dirname, 'data', 'full-products.json');

module.exports = {
  list,
  get,
  create,
  update,
  remove
};

/**
 * List with offset, limit and optional tag filter.
 * Returns { products: [...], total: N }
 */
async function list(options = {}) {
  const { offset = 0, limit = 25, tag } = options;
  const raw = await fs.readFile(productsFile, 'utf8');
  const items = JSON.parse(raw);

  // optional tag filter: matches if the product has a tag (case-insensitive)
  const filtered = tag
    ? items.filter(p => Array.isArray(p.tags) && p.tags.map(t => t.toLowerCase()).includes(String(tag).toLowerCase()))
    : items;

  const total = filtered.length;
  const slice = filtered.slice(offset, offset + limit);

  return { products: slice, total };
}

/**
 * Get single product by id
 */
async function get(id) {
  const raw = await fs.readFile(productsFile, 'utf8');
  const items = JSON.parse(raw);
  return items.find(p => p.id === id) || null;
}

/**
 * Create (placeholder) - just returns the payload. If you wanted to persist:
 *  - read file, push new object, write file
 */
async function create(product) {
  console.log(`PRODUCTS.create (placeholder):`, product);
  // return the same product for now
  return product;
}

/**
 * Update (placeholder) - returns true
 */
async function update(id, changes) {
  console.log(`PRODUCTS.update (placeholder) id=${id}:`, changes);
  return true;
}

/**
 * Remove (placeholder) - returns true
 */
async function remove(id) {
  console.log(`PRODUCTS.remove (placeholder) id=${id}`);
  return true;
}
