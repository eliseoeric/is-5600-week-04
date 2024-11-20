const fs = require('fs').promises;
const path = require('path');

const productsFile = path.join(__dirname, 'data/full-products.json');

module.exports = {
  list,
  get,
  create,
  update,
  remove,
};

/**
 * List all products
 * @param {object} options
 * @returns {Promise<Array>}
 */
async function list (options = {}) {
  const { offset = 0, limit = 25, tag } = options;
  const data = await fs.readFile(productsFile)
  return JSON.parse(data)
  .filter(product =>{
      if(!tag){
          return product
      }

      return product.tags.find(( { title} ) => title== tag )
  })
  .slice(offset, offset + limit)
}


/**
 * Get a single product
 * @param {string} id
 * @returns {Promise<object>}
 */
async function get (id) {
  const products = JSON.parse(await fs.readFile(productsFile))

  // Loop through the products and return the product with the matching id
  for (let i = 0; i < products.length; i++) {
    if (products[i].id === id) {
      return products[i]
    }
  }

   // If no product is found, return null
  return null;
}

/**
 * Create a new product
 * @param {object} product
 * @returns {Promise<object>}
 */
async function create(product) {
  const data = JSON.parse(await fs.readFile(productsFile));
  const newProduct = { id: String(Date.now()), ...product };
  data.push(newProduct);
  await fs.writeFile(productsFile, JSON.stringify(data, null, 2));
  return newProduct;
}

/**
 * Update a product
 * @param {string} id
 * @param {object} updates
 * @returns {Promise<object>}
 */
async function update(id, updates) {
  const data = JSON.parse(await fs.readFile(productsFile));
  const index = data.findIndex((product) => product.id === id);

  if (index === -1) throw new Error('Product not found');

  const updatedProduct = { ...data[index], ...updates };
  data[index] = updatedProduct;
  await fs.writeFile(productsFile, JSON.stringify(data, null, 2));
  return updatedProduct;
}

/**
 * Remove a product
 * @param {string} id
 * @returns {Promise<void>}
 */
async function remove(id) {
  const data = JSON.parse(await fs.readFile(productsFile));
  const filtered = data.filter((product) => product.id !== id);
  await fs.writeFile(productsFile, JSON.stringify(filtered, null, 2));
}
