const path = require('path');
const Products = require('./products');
const autoCatch = require('./lib/auto-catch');

/**
 * Handle the root route
 * @param {object} req
 * @param {object} res
 */
function handleRoot(req, res) {
  res.sendFile(path.join(__dirname, '/index.html'));
}

/**
 * List all products
 * @param {object} req
 * @param {object} res
 */
async function listProducts(req, res) {
  const { offset = 0, limit = 25, tag } = req.query;

  const options = {
    offset: Number(offset),
    limit: Number(limit),
    tag,
  };

  const products = await Products.list(options);
  res.json(products);
}

/**
 * Get a single product by ID
 * @param {object} req
 * @param {object} res
 * @param {function} next
 */
async function getProduct(req, res, next) {
  const { id } = req.params;

  const product = await Products.get(id);
  if (!product) {
    return next(); // Calls middleware for 404 not found
  }

  res.json(product);
}

/**
 * Create a new product
 * @param {object} req
 * @param {object} res
 */
async function createProduct(req, res) {
  console.log('request body', req.body);
  res.json(req.body);
}

module.exports = autoCatch({
  handleRoot,
  listProducts,
  getProduct,
  createProduct,
});
