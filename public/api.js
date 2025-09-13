const path = require('path');
const Products = require('../products');
const autoCatch = require('../lib/auto-catch');

/**
 * Serve root HTML
 */
function handleRoot(req, res) {
  res.sendFile(path.join(__dirname, 'index.html'));
}

/**
 * List products with optional pagination & tag filter
 */
async function listProducts(req, res) {
  const { offset = 0, limit = 25, tag } = req.query;

  res.json(
    await Products.list({
      offset: Number(offset),
      limit: Number(limit),
      tag
    })
  );
}

/**
 * Get a single product
 */
async function getProduct(req, res, next) {
  const { id } = req.params;
  const product = await Products.get(id);

  if (!product) return next();
  res.json(product);
}

/**
 * Create a new product
 */
async function createProduct(req, res) {
  console.log('Create product:', req.body);
  res.status(201).json(req.body);
}

/**
 * Update an existing product
 */
async function updateProduct(req, res) {
  const { id } = req.params;
  console.log(`Update product: ${id}`, req.body);
  res.status(200).json({ message: `Product ${id} updated` });
}

/**
 * Delete a product
 */
async function deleteProduct(req, res) {
  const { id } = req.params;
  console.log(`Delete product: ${id}`);
  res.status(202).json({ message: `Product ${id} deleted` });
}

module.exports = autoCatch({
  handleRoot,
  listProducts,
  getProduct,
  createProduct,
  updateProduct,
  deleteProduct
});
