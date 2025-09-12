const fs = require('fs').promises;
const path = require('path');

const productsFile = path.join(__dirname, 'data/full-products.json');

async function readProducts() {
  const data = await fs.readFile(productsFile, 'utf-8');
  return JSON.parse(data);
}

async function writeProducts(products) {
  await fs.writeFile(productsFile, JSON.stringify(products, null, 2));
}

async function list(options = {}) {
  const { offset = 0, limit = 25 } = options;
  const products = await readProducts();
  return products.slice(offset, offset + limit);
}

async function get(id) {
  const products = await readProducts();
  return products.find(p => String(p.id) === String(id)) || null;
}

async function create(product) {
  const products = await readProducts();
  const newProduct = {
    id: Date.now().toString(), // simple unique id
    ...product
  };
  products.push(newProduct);
  await writeProducts(products);
  console.log(`Product created: ${newProduct.id}`);
  return newProduct;
}

async function update(id, updates) {
  const products = await readProducts();
  const index = products.findIndex(p => String(p.id) === String(id));

  if (index === -1) return null;

  products[index] = { ...products[index], ...updates };
  await writeProducts(products);

  console.log(`Product ${id} updated`);
  return products[index];
}

async function remove(id) {
  const products = await readProducts();
  const index = products.findIndex(p => String(p.id) === String(id));

  if (index === -1) return false;

  products.splice(index, 1);
  await writeProducts(products);

  console.log(`Product ${id} deleted`);
  return true;
}

module.exports = {
  list,
  get,
  create,
  update,
  remove
};
