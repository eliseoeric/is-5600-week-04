
const fs = require('fs').promises;
const path = require('path');

const productsFile = path.join(__dirname, 'data/full-products.json');


module.exports = {
  list,
  get,
  update,
  remove
};


async function list(options = {}) {
  const { offset = 0, limit = 25, tag } = options;

  const data = await fs.readFile(productsFile);
  let products = JSON.parse(data);

  if (tag) {
    products = products.filter(product =>
      Array.isArray(product.tags) &&
      product.tags.some(item => item.title === tag)
    );
  }

  return products.slice(offset, offset + limit);
}

// Get a single product by ID
async function get(id) {
  const products = JSON.parse(await fs.readFile(productsFile));

  for (let i = 0; i < products.length; i++) {
    if (products[i].id === id) {
      return products[i];
    }
  }

  return null;
}

 // Update a product (placeholder)
async function update(id, changes) {
  console.log('Product updated:', id, changes);
  return { id, ...changes };
}

// Delete a product (placeholder)
async function remove(id) {
  console.log('Product deleted:', id);
  return { id };
}
