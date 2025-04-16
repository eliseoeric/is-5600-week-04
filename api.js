const path = require('path')
const Products = require('./products')
const autoCatch = require('./lib/auto-catch')

 /**
 * Handle the root route
 * @param {object} req
 * @param {object} res
*/
function handleRoot (req, res) {
  res.sendFile(path.join(__dirname, '/index.html'));
}

/**
 * List all products
 * @param {object} req
 * @param {object} res
 */
async function listProducts (req, res) {

  // Extract the limit and offset query parameters
  const { offset = 0, limit = 25, tag } = req.query
  // Pass the limit and offset to the Products service
  res.json(await Products.list({
    offset: Number(offset),
    limit: Number(limit),
    tag
  }))
}

async function getProduct (req, res, next) {
  const { id } = req.params

  const product = await Products.get(id)
  if (!product) {
    return next()
  }

  return res.json(product)
}

/**
 * Create a new product
 */
async function createProduct(req, res) {
  const newProduct = await Products.create(req.body);
  res.status(201).json(newProduct);
}

/**
* Delete a product
*/
async function deleteProduct(req, res) {
  const { id } = req.params;
  const response = await Products.deleteProduct(id);
  res.status(response.error ? 404 : 202).json(response);
}

/**
* Update a product
*/
async function updateProduct(req, res) {
  const { id } = req.params;
  const updatedProduct = await Products.update(id, req.body);
  res.status(updatedProduct.error ? 404 : 200).json(updatedProduct);
}

module.exports = autoCatch({
  handleRoot,
  listProducts,
  getProduct,
  createProduct,
  deleteProduct,
  updateProduct
});
