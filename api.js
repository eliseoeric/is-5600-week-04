const path = require('path');
const Products = require('./products');
const autoCatch = require('./lib/auto-catch');

// Serve the index.html file for the root route
async function handleRoot(req, res) {
  try {
    res.sendFile(path.resolve(__dirname, 'index.html'));
  } catch (err) {
    res.status(500).json({ error: 'Failed to load the index file' });
  }
}

// List products with optional pagination and filtering by tag
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
    res.status(500).json({ error: 'Failed to list products', details: err.message });
  }
}

// Get a single product by ID
async function getProduct(req, res, next) {
  try {
    const product = await Products.get(req.params.id);
    if (!product) {
      return next(); // 404 handling will be passed to the next middleware
    }
    res.json(product);
  } catch (err) {
    res.status(500).json({ error: 'Failed to retrieve product', details: err.message });
  }
}

// Create a new product
async function createProduct(req, res) {
  try {
    console.log('Request Body:', req.body);
    // Here, you might want to create the product and save it
    // For now, just return the request body as a mock response
    res.status(201).json(req.body);
  } catch (err) {
    res.status(500).json({ error: 'Failed to create product', details: err.message });
  }
}

// Update an existing product by ID
async function updateProduct(req, res) {
  try {
    const updatedProduct = await Products.update(req.params.id, req.body);
    res.json(updatedProduct);
  } catch (err) {
    res.status(404).json({ error: 'Product not found or failed to update', details: err.message });
  }
}

// Delete a product by ID
async function deleteProduct(req, res) {
  try {
    await Products.remove(req.params.id);
    res.status(200).json({ message: 'Product deleted successfully' });
  } catch (err) {
    res.status(404).json({ error: 'Product not found or failed to delete', details: err.message });
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