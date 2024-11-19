const fs = require('fs').promises;
const path = require('path');

const productsFile = path.join(__dirname, 'data/full-products.json');

module.exports = {
  list,
  get,
  create,
  delete: deleteProduct,
  update,
};

async function list({ offset = 0, limit = 25, tag }) {
  const products = await loadProducts();
  let filteredProducts = products;
  if (tag) {
    filteredProducts = filteredProducts.filter((p) => p.tags?.includes(tag));
  }
  return filteredProducts.slice(offset, offset + limit);
}

async function get(id) {
  const products = await loadProducts();
  return products.find((p) => p.id === id) || null;
}

async function create(productData) {
  const products = await loadProducts();
  const newProduct = { id: generateId(), ...productData };
  products.push(newProduct);
  await saveProducts(products);
  return newProduct;
}

async function deleteProduct(id) {
  let products = await loadProducts();
  const initialLength = products.length;
  products = products.filter((p) => p.id !== id);
  if (products.length === initialLength) return false;
  await saveProducts(products);
  return true;
}

async function update(id, updateData) {
  const products = await loadProducts();
  const productIndex = products.findIndex((p) => p.id === id);
  if (productIndex === -1) return null;
  products[productIndex] = { ...products[productIndex], ...updateData };
  await saveProducts(products);
  return products[productIndex];
}

async function loadProducts() {
  try {
    const data = await fs.readFile(productsFile, 'utf-8');
    return JSON.parse(data || '[]');
  } catch (err) {
    if (err.code === 'ENOENT') return [];
    throw err;
  }
}

async function saveProducts(products) {
  await fs.writeFile(productsFile, JSON.stringify(products, null, 2));
}

function generateId() {
  return `product-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
}