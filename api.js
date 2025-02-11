// api.js
const path = require('path');
const Products = require('./products');
const autoCatch = require('./lib/auto-catch');

function handleRoot(req, res) {
  res.sendFile(path.join(__dirname, '/index.html'));
}

module.exports = autoCatch({
  handleRoot,
  listProducts,
  getProduct,
  createProduct,
  updateProduct,
  deleteProduct,
});

/**
 * List all products
 * @param {object} req
 * @param {object} res
 */
async function listProducts(req, res) {
  const { offset = 0, limit = 25, tag } = req.query;
  const products = await Products.list({
    offset: Number(offset),
    limit: Number(limit),
    tag  
  });
  res.json(products);
}

/**
 * Get a single product
 * @param {object} req
 * @param {object} res
 */
async function getProduct(req, res, next) {
  const { id } = req.params;
  const product = await Products.get(id);
  if (!product) {
    return next();
  }
  return res.json(product);
}

/**
 * Create a new product
 * @param {object} req
 * @param {object} res
 */
async function createProduct(req, res) {
  console.log('request body:', req.body);
  res.json(req.body);
}

/**
 * Update an existing product
 * @param {object} req
 * @param {object} res
 */
async function updateProduct(req, res) {
  const { id } = req.params;
  console.log(`Product with ID ${id} would be updated.`);
  res.status(200).json({ message: `Product with ID ${id} has been updated.` });
}

/**
 * Delete a product
 * @param {object} req
 * @param {object} res
 */
async function deleteProduct(req, res) {
  const { id } = req.params;
  console.log(`Product with ID ${id} would be deleted.`);
  res.status(202).json({ message: `Product with ID ${id} has been deleted.` });
}
