// products.js
const fs = require('fs').promises;
const path = require('path');

const productsFile = path.join(__dirname, 'data/full-products.json');

module.exports = {
  list,
  get
  

};

/**
 * List products with pagination + tag filtering
 */
async function list({ offset = 0, limit = 25, tag }) {
  const raw = await fs.readFile(productsFile, 'utf-8');
  let products = JSON.parse(raw);

  // filter by tag (supports arrays of strings or objects with title/name)
  if (tag) {
    const lowerTag = String(tag).toLowerCase();
    products = products.filter(p => {
      if (!Array.isArray(p.tags)) return false;
      const lowerTags = p.tags
        .map(t => {
          if (typeof t === 'string') return t.toLowerCase();
          if (t && typeof t === 'object') {
            if (typeof t.title === 'string') return t.title.toLowerCase();
            if (typeof t.name === 'string') return t.name.toLowerCase();
          }
          return undefined;
        })
        .filter(Boolean);
      return lowerTags.includes(lowerTag);
    });
  }

  // apply pagination
  return products.slice(offset, offset + limit);
}

/**
 * Get a single product by id
 */
async function get(id) {
  const raw = await fs.readFile(productsFile, 'utf-8');
  const products = JSON.parse(raw);
  const targetId = String(id);
  return products.find(p => String(p.id) === targetId);
}