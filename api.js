const fs = require('fs').promises;
const path = require('path');

// Root Route
async function handleRoot(req, res) {
    res.sendFile(path.join(__dirname, '/index.html'));
}

/**
 * List all products (GET)
 * @param {object} req
 * @param {object} res
 */
async function listProducts(req, res) {
  const productsFile = path.join(__dirname, 'data/full-products.json');
  try {
    const data = await fs.readFile(productsFile, 'utf-8');
    const products = JSON.parse(data);
    res.json(products);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
}

/**
 * Get a single product by ID (GET)
 * @param {object} req
 * @param {object} res
 */
/**
 * Get a single product by ID (GET)
 * @param {object} req
 * @param {object} res
 */
async function getProduct(req, res) {
  const { id } = req.params;
  const productsFile = path.join(__dirname, 'data/full-products.json');

  try {
    // Read the products file
    const data = await fs.readFile(productsFile, 'utf-8');
    const products = JSON.parse(data);
    // Compare ID as strings (no need to use Number())
    const product = products.find(product => product.id === id);
    if (product) {
      res.status(200).json(product);
    } else {
      res.status(404).json({ error: 'Product not found' });
    }
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
}

  
/**
 * Create a new product (POST)
 * @param {object} req
 * @param {object} res
 */
async function createProduct(req, res) {
  console.log('Creating product:', req.body);
  // In a real app, you would save this to a database or a file
  res.status(201).json({ message: 'Product created', product: req.body });
}

/**
 * Update a product (PUT)
 * @param {object} req
 * @param {object} res
 */
async function updateProduct(req, res) {
  const { id } = req.params;
  console.log('Updating product with ID:', id, req.body);
  // In a real app, you would update the product in a database or a file
  res.status(200).json({ message: 'Product updated', product: req.body });
}

/**
 * Delete a product (DELETE)
 * @param {object} req
 * @param {object} res
 */
async function deleteProduct(req, res) {
  const { id } = req.params;
  console.log('Deleting product with ID:', id);
  // In a real app, you would delete the product from a database or a file
  res.status(202).json({ message: 'Product deleted' });
}

module.exports = {
  handleRoot,
  listProducts,
  getProduct,
  createProduct,
  updateProduct,
  deleteProduct
};