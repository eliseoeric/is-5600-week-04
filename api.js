const path = require('path');
const Products = require('./products');
const autoCatch = require('./lib/auto-catch');

// Root route
async function handleRoot(req, res) {
  res.sendFile(path.join(__dirname, 'public/index.html'));
}

// List products
async function listProducts(req, res) {
  const { offset = 0, limit = 25, tag } = req.query;
  const products = await Products.list({
    offset: Number(offset),
    limit: Number(limit),
    tag
  });
  res.json(products);
}

// Get single product
async function getProduct(req, res, next) {
  const { id } = req.params;
  const product = await Products.get(id);
  if (!product) return next();
  res.json(product);
}

// Create product
async function createProduct(req, res) {
  const productData = req.body;
  const product = await Products.create(productData);
  res.status(201).json(product);
}

// Update product
async function updateProduct(req, res) {
  const { id } = req.params;
  const updated = await Products.update(id, req.body);
  res.status(200).json(updated);
}

// Delete product
async function deleteProduct(req, res) {
  const { id } = req.params;
  await Products.remove(id);
  res.status(202).json({ message: `Product ${id} deleted` });
}

// Export routes
module.exports = autoCatch({
  handleRoot,
  listProducts,
  getProduct,
  createProduct,
  updateProduct,
  deleteProduct
});
