const path = require('path');
const Products = require('./products');

/**
 * Handle the root route
 * @param {object} req
 * @param {object} res
 */
function handleRoot(req, res) {
  // Adjust to serve the correct location of index.html
  res.sendFile(path.join(__dirname, 'index.html'));
}

/**
 * List all products
 * @param {object} req
 * @param {object} res
 */
async function listProducts(req, res) {
  const { limit = 10, offset = 0, tag } = req.query;

  try {
    const products = await Products.list({ limit: Number(limit), offset: Number(offset), tag });
    res.json(products);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
}

/**
 * Get a single product by ID
 * @param {object} req
 * @param {object} res
 */
async function getProduct(req, res, next) {
  const { id } = req.params;

  try {
    const product = await Products.get(id);
    if (!product) return next(); // Pass to 404 middleware if not found
    res.json(product);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
}

/**
 * Create a new product
 * @param {object} req
 * @param {object} res
 */
async function createProduct(req, res) {
  const newProduct = req.body;
  // Logic to add the product (not fully implemented here)
  res.status(201).json(newProduct);
}

/**
 * Update an existing product
 * @param {object} req
 * @param {object} res
 */
async function updateProduct(req, res) {
  const { id } = req.params;
  const updatedData = req.body;
  // Logic to update the product (not fully implemented here)
  res.status(200).json({ id, ...updatedData });
}

/**
 * Delete a product
 * @param {object} req
 * @param {object} res
 */
async function deleteProduct(req, res) {
  const { id } = req.params;
  // Logic to delete the product (not fully implemented here)
  res.status(202).json({ message: `Product ${id} deleted` });
}

module.exports = {
  handleRoot,
  listProducts,
  getProduct,
  createProduct,
  updateProduct,
  deleteProduct,
};