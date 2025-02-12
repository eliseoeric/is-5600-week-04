const fs = require('fs').promises;
const path = require('path');
const productsFile = path.join(__dirname, 'data/full-products.json');

// Helper function to read the products data
async function readData() {
  const data = await fs.readFile(productsFile, 'utf-8');
  return JSON.parse(data);
}

// Helper function to write updated data to the file
async function writeData(data) {
  await fs.writeFile(productsFile, JSON.stringify(data, null, 2), 'utf-8');
}

async function list({ offset = 0, limit = 25, tag }) {
  const data = await readData();
  return data
    .filter(product => !tag || product.tags.some(({ title }) => title === tag)) // Filter by tag if specified
    .slice(offset, offset + limit); // Paginate the results
}

async function get(id) {
  const data = await readData();
  return data.find(product => product.id === id) || null; // Find product by id or return null
}

async function update(id, newData) {
  const data = await readData();
  const index = data.findIndex(product => product.id === id);
  if (index === -1) throw new Error(`Product with id ${id} not found`);
  data[index] = { ...data[index], ...newData }; // Merge new data with existing product data
  await writeData(data); // Write the updated data back to the file
  return data[index];
}

async function remove(id) {
  const data = await readData();
  const newData = data.filter(product => product.id !== id);
  if (newData.length === data.length) throw new Error(`Product with id ${id} not found`);
  await writeData(newData); // Write the updated data back to the file
}

module.exports = { list, get, update, remove };