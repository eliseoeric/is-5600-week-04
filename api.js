const fs = require('fs').promises;
const path = require('path');

const productsFile = path.join(__dirname, 'data/full-products.json');

/**
 * Handle the root route
 */
function handleRoot(req, res) {
  res.sendFile(path.join(__dirname, 'public/index.html'));
}

/**
 * List all products
 */
async function listProducts(req, res) {
  try {
    const data = await fs.readFile(productsFile);
    res.json(JSON.parse(data));
  } catch (err) {
    res.status(500).json({ error: 'Failed to load products' });
  }
}

/**
 * Get a single product by ID
 */
async function getProduct(req, res) {
  try {
    const data = await fs.readFile(productsFile);
    const products = JSON.parse(data);
    const product = products.find(p => p.id === parseInt(req.params.id));

    if (!product) {
      return res.status(404).json({ error: 'Product not found' });
    }

    res.json(product);
  } catch (err) {
    res.status(500).json({ error: 'Failed to fetch product' });
  }
}

/**
 * Create a new product
 */
async function createProduct(req, res) {
  try {
    const data = await fs.readFile(productsFile);
    const products = JSON.parse(data);
    const newProduct = { id: Date.now(), ...req.body };

    products.push(newProduct);
    await fs.writeFile(productsFile, JSON.stringify(products, null, 2));

    res.status(201).json(newProduct);
  } catch (err) {
    res.status(500).json({ error: 'Failed to create product' });
  }
}

/**
 * Update a product by ID
 */
async function updateProduct(req, res) {
  try {
    const data = await fs.readFile(productsFile);
    let products = JSON.parse(data);
    const index = products.findIndex(p => p.id === parseInt(req.params.id));

    if (index === -1) {
      return res.status(404).json({ error: 'Product not found' });
    }

    products[index] = { ...products[index], ...req.body };
    await fs.writeFile(productsFile, JSON.stringify(products, null, 2));

    res.json(products[index]);
  } catch (err) {
    res.status(500).json({ error: 'Failed to update product' });
  }
}

/**
 * Delete a product by ID
 */
async function deleteProduct(req, res) {
  try {
    const data = await fs.readFile(productsFile);
    let products = JSON.parse(data);
    const newProducts = products.filter(p => p.id !== parseInt(req.params.id));

    await fs.writeFile(productsFile, JSON.stringify(newProducts, null, 2));

    res.json({ message: 'Product deleted' });
  } catch (err) {
    res.status(500).json({ error: 'Failed to delete product' });
  }
}

// Export the functions
module.exports = {
  handleRoot,
  listProducts,
  getProduct,
  createProduct,
  updateProduct,
  deleteProduct,
};
