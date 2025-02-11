const path = require('path'); 
const Products = require('./products');
const autoCatch = require('./lib/auto-catch');

/**
 * Handle the root route
 * @param {object} req
 * @param {object} res
 */
async function handleRoot(req, res) {
  res.sendFile(path.join(__dirname, '/index.html'));
}

/**
 * List all products with filtering and pagination
 * @param {object} req
 * @param {object} res
 */
async function listProducts(req, res) {
  const { offset = 0, limit = 25, tag } = req.query;
  
  res.json(await Products.list({
    offset: Number(offset),
    limit: Number(limit),
    tag
  }));
}

/**
 * Get a single product by ID
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
  const newProduct = await Products.create(req.body);
  res.status(201).json(newProduct);
}

/**
 * Update a product
 * @param {object} req
 * @param {object} res
 */
async function updateProduct(req, res) {
  console.log(`Product with ID ${req.params.id} updated`);
  res.status(200).json({ message: `Product with ID ${req.params.id} updated` });
}

/**
 * Delete a product
 * @param {object} req
 * @param {object} res
 */
async function deleteProduct(req, res) {
  console.log(`Product with ID ${req.params.id} deleted`);
  res.status(202).json({ message: `Product with ID ${req.params.id} deleted` });
}

// Export with auto-catch for automatic error handling
module.exports = autoCatch({
  handleRoot,
  listProducts,
  getProduct,
  createProduct,
  updateProduct,
  deleteProduct
});