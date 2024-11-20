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
 */
async function listProducts(req, res) {
  const { offset = 0, limit = 25, tag } = req.query;

  try {
    res.json(
      await Products.list({
        offset: Number(offset),
        limit: Number(limit),
        tag,
      })
    );
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
}

/**
 * Get a single product by ID
 */
async function getProduct(req, res, next) {
  const { id } = req.params;

  try {
    const product = await Products.get(id);
    if (!product) return next();
    res.json(product);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
}

/**
 * Create a new product
 */
async function createProduct(req, res) {
  console.log('Request body:', req.body);
  res.json(req.body);
}

/**
 * Update an existing product (PUT route)
 */
async function updateProduct(req, res) {
  const { id } = req.params;
  console.log(`Product with ID ${id} was updated:`, req.body);
  res.status(200).json({ message: `Product with ID ${id} was updated` });
}

/**
 * Delete a product (DELETE route)
 */
async function deleteProduct(req, res) {
  const { id } = req.params;
  console.log(`Product with ID ${id} was deleted`);
  res.status(202).json({ message: `Product with ID ${id} was deleted` });
}

module.exports = autoCatch({
  handleRoot,
  listProducts,
  getProduct,
  createProduct,
  updateProduct, // Register the new method
  deleteProduct, // Register the new method
});
