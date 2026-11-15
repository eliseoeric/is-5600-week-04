
const path = require('path');
const Products = require('./products');
const autoCatch = require('./lib/auto-catch');

// Handle home page
function handleRoot(req, res) {
  res.sendFile(path.join(__dirname, 'index.html'));
}

// List products
async function listProducts(req, res) {
  const {
    offset = 0,
    limit = 25,
    tag
  } = req.query;

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

  if (!product) {
    return next();
  }

  res.json(product);
}

// Create product
async function createProduct(req, res) {
  console.log('request body:', req.body);
  res.json(req.body);
}

// Delete product
async function deleteProduct(req, res) {
  await Products.deleteProduct(req.params.id);

  res.status(202).json({
    message: 'Product deleted'
  });
}

// Update product
async function updateProduct(req, res) {
  await Products.updateProduct(req.params.id, req.body);

  res.status(200).json({
    message: 'Product updated'
  });
}

module.exports = autoCatch({
  handleRoot,
  listProducts,
  getProduct,
  createProduct,
  deleteProduct,
  updateProduct
});
