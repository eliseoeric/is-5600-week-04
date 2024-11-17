const Products = require('./products');

async function handleRoot(req, res) {
  res.sendFile(path.join(__dirname, '../public/index.html'));
}

async function listProducts(req, res) {
  const { offset = 0, limit = 25, tag } = req.query;

  const options = {
    offset: Number(offset),
    limit: Number(limit),
    tag,
  };

  res.json(await Products.list(options));
}

async function getProduct(req, res, next) {
  const { id } = req.params;
  const product = await Products.get(id);
  if (!product) return next();
  res.json(product);
}

module.exports = { handleRoot, listProducts, getProduct };
const autoCatch = require('../lib/auto-catch');

module.exports = autoCatch({
  handleRoot,
  listProducts,
  getProduct,
});
const express = require('express');
const api = require('./api/api');
const middleware = require('./api/middleware');

const app = express();
const PORT = 3000;

// Middleware
app.use(middleware.cors);

// Routes
app.get('/', api.handleRoot);
app.get('/products', api.listProducts);
app.get('/products/:id', api.getProduct);

// Error handling
app.use(middleware.notFound);
app.use(middleware.handleError);

// Start server
app.listen(PORT, () => {
  console.log(`Server running at http://localhost:${PORT}`);
});
