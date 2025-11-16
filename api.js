// api.js
const path = require('path');
const Products = require('./products');
const autoCatch = require('./lib/auto-catch');

// Serve the frontend index (if present)
function handleRoot (req, res) {
  res.sendFile(path.join(__dirname, '/index.html'));
}

/**
 * List all products (supports offset, limit, tag)
 */
async function listProducts (req, res) {
  const { offset = 0, limit = 25, tag } = req.query;
  // Products.list returns { products, total }
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
async function getProduct (req, res, next) {
  const { id } = req.params;
  const product = await Products.get(id);
  if (!product) return next(); // let express go to notFound middleware
  res.json(product);
}

/**
 * Create product (placeholder - just echo and log)
 */
async function createProduct (req, res) {
  const payload = req.body;
  console.log('Creating product (placeholder):', payload);
  // In a real app we'd persist; for the lab just respond 201 with payload
  res.status(201).json({ message: 'Product created (placeholder)', product: payload });
}

/**
 * Update product (placeholder)
 */
async function updateProduct (req, res) {
  const { id } = req.params;
  const payload = req.body;
  console.log(`Updating product ${id} (placeholder):`, payload);
  res.status(200).json({ message: `Product ${id} updated (placeholder)` });
}

/**
 * Delete product (placeholder)
 */
async function deleteProduct (req, res) {
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
