// api.js
const path = require('path');
const Products = require('./products');
const autoCatch = require('./lib/auto-catch');

// Serve the frontend index (if present)
function handleRoot(req, res) {
  res.sendFile(path.join(__dirname, '/index.html'));
}

/**
 * List all products (supports offset, limit, tag)
 */
async function listProducts(req, res) {
  const { offset = 0, limit = 25, tag } = req.query;
  const result = await Products.list({
    offset: Number(offset),
    limit: Number(limit),
    tag
  });
  res.json(result);
}

/**
 * Get one product by id
 */
async function getProduct(req, res, next) {
  const { id } = req.params;
  const product = await Products.get(id);
  if (!product) return next(); // goes to 404 handler
  res.json(product);
}

/**
 * Create a product (placeholder - just echo and log)
 */
async function createProduct(req, res) {
  const payload = req.body;
  console.log('Creating product (placeholder):', payload);
  res.status(201).json({ message: 'Product created (placeholder)', product: payload });
}

/**
 * Update product (placeholder)
 */
async function updateProduct(req, res) {
  const { id } = req.params;
  const payload = req.body;
  console.log(`Updating product ${id} (placeholder):`, payload);
  res.status(200).json({ message: `Product ${id} updated (placeholder)` });
}

/**
 * Delete product (placeholder)
 */
async function deleteProduct(req, res) {
  const { id } = req.params;
  console.log(`Deleting product ${id} (placeholder)`);
  res.status(202).json({ message: `Product ${id} deleted (placeholder)` });
}

module.exports = autoCatch({
  handleRoot,
  listProducts,
  getProduct,
  createProduct,
  updateProduct,
  deleteProduct
});
