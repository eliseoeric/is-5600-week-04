// products.js
const fs = require('fs').promises;
const path = require('path');
const PRODUCTS_FILE = path.join(__dirname, 'data', 'full-products.json');

async function list(options = { offset: 0, limit: 25, tag: null }) {
  let data = JSON.parse(await fs.readFile(PRODUCTS_FILE));
  if (options.tag) {
    data = data.filter(p => p.tags.includes(options.tag));
  }
  return data.slice(options.offset, options.offset + options.limit);
}
module.exports = { list };
async function get(id) {
  const data = JSON.parse(await fs.readFile(PRODUCTS_FILE));
  return data.find(p => p.id === id) || null;
}
module.exports = { ...module.exports, get };
async function create(product) {
  console.log('Product to create:', product);
  return product;
}
async function update(id, data) {
  console.log(`Update product ${id}:`, data);
  return true;
}
async function remove(id) {
  console.log('Delete product with id:', id);
  return true;
}
module.exports = { ...module.exports, create, update, remove };
