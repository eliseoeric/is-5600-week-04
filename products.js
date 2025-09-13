const fs = require('fs').promises;
const path = require('path');

const productsFile = path.join(__dirname, 'data/full-products.json');

// normalize tags into string[]
function normalize(product) {
  return {
    id: product.id,
    name: product.name || product.title || "Unnamed Product",
    price: product.price || 0,
    tags: Array.isArray(product.tags)
      ? product.tags.map(t => (typeof t === "string" ? t : t.title || "unknown"))
      : []
  };
}

// list with pagination + optional tag
async function listAll({ limit = 5, offset = 0, tag }) {
  const data = JSON.parse(await fs.readFile(productsFile, 'utf8'));
  let results = data.map(normalize);

  if (tag) {
    results = results.filter(item => item.tags.includes(tag));
  }

  return results.slice(offset, offset + limit);
}

// find by id
async function findById(id) {
  const data = JSON.parse(await fs.readFile(productsFile, 'utf8'));
  const product = data.find(item => item.id === id);
  return product ? normalize(product) : null;
}

module.exports = { listAll, findById };
