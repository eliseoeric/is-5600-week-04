const path = require('path');
const fs = require('fs').promises;
const Products = require('./products');

// Handle the root route
function handleRoot(req, res) {
  res.sendFile(path.join(__dirname, '/index.html'));
}

// List all products
async function listProducts(req, res) {
  const { offset = 0, limit = 25, tag } = req.query;
  
  try {
    const products = await Products.list({
      offset: Number(offset),
      limit: Number(limit),
      tag
    });
    res.json(products);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
}

// Fetch a single product by id
async function getProduct(req, res, next) {
  const { id } = req.params;
  
  try {
    const product = await Products.get(id);
    if (!product) {
      return next();
    }

    return res.json(product);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
}

// Create a product (Placeholder for now)
async function createProduct(req, res) {
    console.log('Request Body:', req.body);
    res.json(req.body);  // Placeholder logic for now
}  

// Update a product
async function updateProduct(req, res) {
    const { id } = req.params;
    console.log(`Updating product with ID: ${id}`, req.body);
    res.status(200).json({ message: 'Product updated successfully' });
}  

// Delete a product
async function deleteProduct(req, res) {
    const { id } = req.params;
    console.log(`Deleting product with ID: ${id}`);
    res.status(202).json({ message: 'Product deleted successfully' });
}  

module.exports = {
  handleRoot,
  listProducts,
  getProduct,
  createProduct,
  updateProduct,
  deleteProduct,
};
