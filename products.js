const fs = require('fs').promises;
const path = require('path');
const productsFile = path.join(__dirname, 'data/full-products.json');

async function list({ offset = 0, limit = 25, tag }) {
  const data = JSON.parse(await fs.readFile(productsFile));
  return data.filter(product => (!tag || product.tags.some(({ title }) => title === tag))).slice(offset, offset + limit);
}

async function get(id) {
  const data = JSON.parse(await fs.readFile(productsFile));
  return data.find(product => product.id === id) || null;
}

async function update(id, newData) {
  const data = JSON.parse(await fs.readFile(productsFile));
  const index = data.findIndex(product => product.id === id);
  if (index === -1) throw new Error(`Product with id ${id} not found`);
  data[index] = { ...data[index], ...newData };
  await fs.writeFile(productsFile, JSON.stringify(data, null, 2));
  return data[index];
}

async function remove(id) {
  const data = JSON.parse(await fs.readFile(productsFile));
  const newData = data.filter(product => product.id !== id);
  if (newData.length === data.length) throw new Error(`Product with id ${id} not found`);
  await fs.writeFile(productsFile, JSON.stringify(newData, null, 2));
}

module.exports = { list, get, update, remove };