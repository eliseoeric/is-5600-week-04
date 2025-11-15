// products.js
const fs = require("fs").promises;
const path = require("path");

const productsFile = path.join(__dirname, "data/full-products.json");

module.exports = {
  list,
  get
};

/**
 * List products with pagination + tag filter
 */
async function list(options = {}) {
  const { offset = 0, limit = 25, tag } = options;

  const data = JSON.parse(await fs.readFile(productsFile));
  let filtered = data;

  if (tag) {
    filtered = filtered.filter((p) => p.tag === tag);
  }

  return filtered.slice(offset, offset + limit);
}

/**
 * Get a single product by ID
 */
async function get(id) {
  const products = JSON.parse(await fs.readFile(productsFile));

  for (const p of products) {
    if (p.id === id) return p;
  }

  return null;
}
