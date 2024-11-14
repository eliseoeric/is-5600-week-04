const fs = require('fs').promises;
const path = require('path');

const productsFile = path.join(__dirname, 'data/full-products.json');

async function list(options = {}) {
  const { offset = 0, limit = 25, tag } = options;

  const data = await fs.readFile(productsFile);
  return JSON.parse(data)
    .filter(product => {
      if (!tag) return product;
      return product.tags.find(({ title }) => title == tag);
    })
    .slice(offset, offset + limit);
}

async function get(id) {
  const products = JSON.parse(await fs.readFile(productsFile));
  return products.find(product => product.id === id) || null;
}

async function deleteProduct(id) {
  const products = JSON.parse(await fs.readFile(productsFile));
  const filteredProducts = products.filter(product => product.id !== id);
  
  await fs.writeFile(productsFile, JSON.stringify(filteredProducts, null, 2));
  console.log(`Product with ID ${id} deleted`);
}

async function updateProduct(id, newProductData) {
  const products = JSON.parse(await fs.readFile(productsFile));
  const index = products.findIndex(product => product.id === id);

  if (index !== -1) {
    products[index] = { ...products[index], ...newProductData };
    await fs.writeFile(productsFile, JSON.stringify(products, null, 2));
    console.log(`Product with ID ${id} updated with data:`, newProductData);
  }
}

module.exports = {
  list,
  get,
  deleteProduct,
  updateProduct,
};
