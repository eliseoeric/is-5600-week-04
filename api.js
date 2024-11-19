const path = require('path');
const Products = require('./products');
const autoCatch = require('./lib/auto-catch');

/**
 * Handle the root route
 * @param {object} req
 * @param {object} res
 */
function handleRoot(req, res) {
  res.sendFile(path.join(__dirname, '/index.html'));
}

/**
 * List all products
 * @param {object} req
 * @param {object} res
 */
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

/**
 * Get a product by ID
 * @param {object} req
 * @param {object} res
 * @param {function} next
 */
async function getProduct(req, res, next) {
  const { id } = req.params;

  try {
    const product = await Products.get(id);
    if (!product) {
      return res.status(404).json({ error: 'Product not found' });
    }
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
  const productData = req.body;

  try {
    const newProduct = await Products.create(productData);
    res.status(201).json(newProduct);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
}

/**
 * Delete a product by ID
 * @param {object} req
 * @param {object} res
 */
async function deleteProduct(req, res) {
  const { id } = req.params;

  try {
    console.log(`DELETE request received for product ID: ${id}`);
    await Products.delete(id);
    res.status(202).json({ message: `Product with ID ${id} deleted.` });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
}

/**
 * Update a product by ID
 * @param {object} req
 * @param {object} res
 */
async function updateProduct(req, res) {
  const { id } = req.params;
  const updatedData = req.body;

  try {
    console.log(`PUT request received for product ID: ${id}`);
    console.log('Updated data:', updatedData);
    const updatedProduct = await Products.update(id, updatedData);
    res.status(200).json({ message: `Product with ID ${id} updated.`, updatedProduct });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
}

module.exports = autoCatch({
  handleRoot,
  listProducts,
  getProduct,
  createProduct,
  deleteProduct,
  updateProduct,
});
