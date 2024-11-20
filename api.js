const Products = require('./products');
const autoCatch = require('../lib/auto-catch');
const path = require('path');

// Route Handlers

async function handleRoot(req, res) {
  res.sendFile(path.join(__dirname, '../public/index.html'));
}

async function listProducts(req, res) {
  const { offset = 0, limit = 25, tag } = req.query;
  res.json(await Products.list({ offset: Number(offset), limit: Number(limit), tag }));
}

async function getProduct(req, res, next) {
  const { id } = req.params;
  const product = await Products.get(id);
  if (!product) return next();
  return res.json(product);
}

async function createProduct(req, res) {
  console.log('Request body:', req.body);
  res.json(req.body);  // Simulate product creation by returning the body
}

async function deleteProduct(req, res) {
  const { id } = req.params;
  console.log(`Product with ID: ${id} has been deleted.`);  // Simulate deletion by logging
  res.status(202).json({ message: `Product with ID: ${id} has been deleted.` });
}

async function updateProduct(req, res) {
  const { id } = req.params;
  console.log(`Product with ID: ${id} has been updated.`);  // Simulate update by logging
  res.status(200).json({ message: `Product with ID: ${id} has been updated.` });
}

// Exporting all route handlers
module.exports = autoCatch({
  handleRoot,
  listProducts,
  getProduct,
  createProduct,
  deleteProduct,
  updateProduct
});
