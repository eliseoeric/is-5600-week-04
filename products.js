const fs = require('fs').promises;
// const { get } = require('express/lib/response'); // <-- remove this line
const path = require('path');
const productsFile = path.join(__dirname, 'data/full-products.json');

async function list(options = {}) {
  const { offset = 0, limit = 25, tag } = options;
  const data = await fs.readFile(productsFile);
  return JSON.parse(data)
    .filter(product => {
      if (!tag) {
        return product;
      }
      return product.tags.find(({ title }) => title == tag);
    })
    .slice(offset, offset + limit);
}

async function get(id) {
  const products = JSON.parse(await fs.readFile(productsFile));

  // Loop through the products and return the product with the matching id
  for (let i = 0; i < products.length; i++) {
    if (products[i].id === id) {
      return products[i];
    }
  }

  // If no product is found, return null
  return null;
}
async function update(id, updates) {
  const products = JSON.parse(await fs.readFile(productsFile));

  const index = products.findIndex(p => p.id === id);
  if (index === -1) return null;

  const updatedProduct = { ...products[index], ...updates };
  products[index] = updatedProduct;

  await fs.writeFile(productsFile, JSON.stringify(products, null, 2));
  return updatedProduct;
}

async function remove(id) {
  const products = JSON.parse(await fs.readFile(productsFile));

  const filtered = products.filter(p => p.id !== id);
  if (filtered.length === products.length) return null;

  await fs.writeFile(productsFile, JSON.stringify(filtered, null, 2));
  return true;
}

module.exports = {
  list,
  get,
  update,
  remove
};
