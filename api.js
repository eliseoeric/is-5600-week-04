const path = require('path');
const Products = require('./products');
const autoCatch = require('./lib/auto-catch');

async function handleRoot(req, res) {
  res.sendFile(path.join(__dirname, '/index.html'));
}

async function listProducts(req, res) {
  const { offset = 0, limit = 25, tag } = req.query;
  try {
    const products = await Products.list({
      offset: Number(offset),
      limit: Number(limit),
      tag,
    });
    res.json(products);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
}

async function getProduct(req, res, next) {
  try {
    const product = await Products.get(req.params.id);
    if (!product) return next();
    res.json(product);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
}

async function createProduct(req, res) {
  console.log('Request Body:', req.body);
  res.json(req.body);
}

async function updateProduct(req, res) {
  try {
    const updatedProduct = await Products.update(req.params.id, req.body);
    res.json(updatedProduct);
  } catch (err) {
    res.status(404).json({ error: err.message });
  }
}

async function deleteProduct(req, res) {
  try {
    await Products.remove(req.params.id);
    res.status(200).json({ message: 'Product deleted successfully' });
  } catch (err) {
    res.status(404).json({ error: err.message });
  }
}

module.exports = autoCatch({
  handleRoot,
  listProducts,
  getProduct,
  createProduct,
  updateProduct,
  deleteProduct,
});
