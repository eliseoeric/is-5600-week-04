const fs = require('fs').promises;
const path = require('path');

const productsFile = path.join(__dirname, '../data/full-products.json');

async function list({ offset = 0, limit = 25, tag } = {}) {
  const products = JSON.parse(await fs.readFile(productsFile));
  let filtered = products;

  if (tag) {
    filtered = products.filter((product) => product.tags.includes(tag));
  }

  return {
    total: filtered.length,
    products: filtered.slice(offset, offset + limit),
  };
}

async function get(id) {
  const products = JSON.parse(await fs.readFile(productsFile));
  return products.find((product) => product.id === id) || null;
}

module.exports = { list, get };
