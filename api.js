
const path = require('path');
const Products = require('./products');
const autoCatch = require('./lib/auto-catch');

// Handle the root route
function handleRoot(req, res) {
  res.sendFile(path.join(__dirname, 'index.html'));
}

// List products with pagination and tag filtering
async function listProducts(req, res) {
  const { offset = 0, limit = 25, tag } = req.query;

  res.json(await Products.list({
    offset: Number(offset),
    limit: Number(limit),
    tag
  }));
}

// Get a single product
async function getProduct(req, res, next) {
  const { id } = req.params;

  const product = await Products.get(id);

  if (!product) {
    return next();
  }

  return res.json(product);
}

// Automatically catch errors in route handlers

// Create a new product
async function createProduct(req, res) {
  console.log('request body:', req.body);
  res.json(req.body);
}


async function updateProduct(req, res) {
  const { id } = req.params;
  const product = await Products.update(id, req.body);

  res.status(200).json({
    message: 'Product updated',
    product
  });
}

async function deleteProduct(req, res) {
  const { id } = req.params;
  await Products.remove(id);

  res.status(202).json({
    message: 'Product deleted',
    id
  });
}


module.exports = autoCatch({
  handleRoot,
  listProducts,
  getProduct,
  createProduct,
  updateProduct,
  deleteProduct
});

