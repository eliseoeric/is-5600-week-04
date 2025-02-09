// products.js
const fs = require('fs').promises
const path = require('path')

const productsFile = path.join(__dirname, 'data/full-products.json')



/**
 * List all products
 * @returns {Promise<Array>}
 */
async function list (options = {}) {
  const { offset = 0, limit = 25 } = options
  const data = await fs.readFile(productsFile)

  return JSON.parse(data).slice(offset, offset + limit) // Slice the products
}

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
async function deleteProduct(req, res) {
  const { id } = req.params;
  console.log(`Product with ID ${id} deleted.`);
  res.status(202).json({ message: `Product with ID ${id} deleted.` });
}

/**
 * Update a product (mock)
 * @param {object} req
 * @param {object} res
 */
async function updateProduct(req, res) {
  const { id } = req.params;
  console.log(`Product with ID ${id} updated.`);
  res.status(200).json({ message: `Product with ID ${id} updated.` });
}

module.exports = {
  list,
  get,
  deleteProduct,
  updateProduct
}