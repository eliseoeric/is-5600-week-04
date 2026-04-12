const fs = require('fs').promises;
const path = require('path');

const productsFile = path.join(__dirname, 'data/full-products.json');

module.exports = {
  list,
  get
};

async function list(options = {}) {
  const { offset = 0, limit = 25, tag } = options;
  let data = JSON.parse(await fs.readFile(productsFile));

  // FILTER by tag
  if (tag) {
    data = data.filter(p => p.tags && p.tags.includes(tag));
  }

  return data.slice(offset, offset + limit);
}

async function get(id) {
  const products = JSON.parse(await fs.readFile(productsFile));

  return products.find(p => p.id === id) || null;
}