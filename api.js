// api.js
const path = require('path');
const Products = require('./products');
const autoCatch = require('./lib/auto-catch');

/**
 * Handle root → return index.html
 */
function handleRoot(req, res) {
  res.sendFile(path.join(__dirname, 'index.html'));
}

/**
 * GET /products
 * Supports: limit, offset, tag, pretty
 */
async function listProducts(req, res) {
  const { offset = 0, limit = 25, tag, pretty } = req.query;
  const parsedOffset = Math.max(0, parseInt(offset, 10) || 0);
  const parsedLimit = Math.max(0, Math.min(100, parseInt(limit, 10) || 25));

  const products = await Products.list({
    offset: parsedOffset,
    limit: parsedLimit,
    tag
  });

  if (pretty === "true") {
    return res
      .setHeader("Content-Type", "application/json")
      .send(JSON.stringify(products, null, 2));
  }

  return res.json(products);
}

/**
 * GET /products/:id
 */
async function getProduct(req, res, next) {
  const { pretty } = req.query;
  const product = await Products.get(req.params.id);

  if (!product) return next();

  if (pretty === "true") {
    return res
      .setHeader("Content-Type", "application/json")
      .send(JSON.stringify(product, null, 2));
  }

  return res.json(product);
}

/**
 * POST /products (placeholder)
 */
async function createProduct(req, res) {
  console.log('New product received:', req.body);
  return res.status(201).json({
    message: 'Product created',
    data: req.body
  });
}

/**
 * PUT /products/:id (placeholder)
 */
async function updateProduct(req, res) {
  const { id } = req.params;
  console.log('update product:', id, 'body:', req.body);
  return res.status(200).json({ updated: true, id, body: req.body });
}

/**
 * DELETE /products/:id (placeholder)
 */
async function deleteProduct(req, res) {
  const { id } = req.params;
  console.log('delete product:', id);
  return res.status(202).json({ deleted: true, id });
}

module.exports = autoCatch({
  handleRoot,
  listProducts,
  getProduct,
  createProduct,
  updateProduct,
  deleteProduct
});