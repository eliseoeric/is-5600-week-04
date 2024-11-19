const Products = require('./products');
const autoCatch = require('./lib/auto-catch');

module.exports = autoCatch({
  handleRoot,
  listProducts,
  getProduct,
  createProduct,
  deleteProduct,
  updateProduct,
});

async function handleRoot(req, res) {
  const path = require('path');
  res.sendFile(path.join(__dirname, '/public/index.html'));
}

async function listProducts(req, res) {
  const { offset = 0, limit = 25, tag } = req.query;
  const products = await Products.list({
    offset: Number(offset),
    limit: Number(limit),
    tag,
  });
  res.status(200).json(products);
}

async function getProduct(req, res, next) {
  const product = await Products.get(req.params.id);
  if (!product) return res.status(404).json({ error: 'Product not found' });
  res.status(200).json(product);
}

async function createProduct(req, res) {
  const { name, price, tags } = req.body;
  if (!name || typeof price !== 'number') {
    return res.status(400).json({ error: 'Invalid product data' });
  }
  const product = await Products.create({ name, price, tags });
  res.status(201).json(product);
}

async function deleteProduct(req, res) {
  const deleted = await Products.delete(req.params.id);
  if (!deleted) return res.status(404).json({ error: 'Product not found' });
  res.status(202).json({ message: 'Product deleted' });
}

async function updateProduct(req, res) {
  const { name, price, tags } = req.body;
  if (!name && !price && !tags) {
    return res.status(400).json({ error: 'No fields to update' });
  }
  const updatedProduct = await Products.update(req.params.id, req.body);
  if (!updatedProduct) {
    return res.status(404).json({ error: 'Product not found' });
  }
  res.status(200).json(updatedProduct);
}