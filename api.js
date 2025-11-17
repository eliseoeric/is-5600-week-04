// api.js
const Products = require('./products');
const autoCatch = require('./lib/auto-catch');

// Serve the frontend index from /public without needing 'path'
async function handleRoot(req, res) {
  res.sendFile('index.html', { root: __dirname + '/public' });
}

// GET /products?offset=0&limit=25&tag=electronics
async function listProducts(req, res) {
  const { offset = 0, limit = 25, tag } = req.query;
  const result = await Products.list({
    offset: Number(offset),
    limit: Number(limit),
    tag
  });
  res.json(result);
}

// GET /products/:id
async function getProduct(req, res, next) {
  const { id } = req.params;
  const product = await Products.get(id);
  if (!product) return next(); // 404 handler
  res.json(product);
}

// POST /products
async function createProduct(req, res) {
  // placeholder behavior per lab
  const created = await Products.create(req.body);
  res.status(201).json(created);
}

// PUT /products/:id
async function updateProduct(req, res) {
  const { id } = req.params;
  const updated = await Products.update(id, req.body);
  res.status(200).json(updated);
}

// DELETE /products/:id
async function deleteProduct(req, res) {
  const { id } = req.params;
  await Products.remove(id);
  res.status(202).json({ ok: true });
}

// export all handlers, wrapped for async error forwarding
module.exports = autoCatch({
  handleRoot,
  listProducts,
  getProduct,
  createProduct,
  updateProduct,
  deleteProduct
});
