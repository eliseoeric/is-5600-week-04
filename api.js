const path = require('path');
const Products = require('./products');
const autoCatch = require('./lib/auto-catch');

// Serve the professor’s root index.html
async function handleRoot(req, res) {
  res.sendFile(path.join(__dirname, 'index.html'));
}

/**
 * GET /products?offset&limit&tag
 * NOTE: return an ARRAY so the provided frontend works.
 */
async function listProducts(req, res) {
  const { offset = 0, limit = 25, tag } = req.query;
  const products = await Products.list({
    offset: Number(offset),
    limit: Number(limit),
    tag
  });
  res.json(products); // array expected by /public/index.js
}

/** GET /products/:id */
async function getProduct(req, res, next) {
  const product = await Products.get(req.params.id);
  if (!product) return next();
  res.json(product);
}

/** POST /products (stub) */
async function createProduct(req, res) {
  const created = await Products.create(req.body || {});
  res.status(201).json(created);
}

/** PUT /products/:id (stub) */
async function updateProduct(req, res) {
  const updated = await Products.update(req.params.id, req.body || {});
  res.status(200).json(updated);
}

/** DELETE /products/:id (stub) */
async function deleteProduct(req, res) {
  await Products.remove(req.params.id);
  res.status(202).json({
    ok: true,
    message: `Product ${req.params.id} deleted`
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