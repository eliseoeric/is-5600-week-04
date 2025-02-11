// api.js
const path = require('path');
const Products = require('./products'); // Correct the path if needed
//const autoCatch = require('lib/auto-catch'); // If you have this library, keep it. If not, remove it.  I've removed it for this example

/**
 * Handle the root route
 * @param {object} req
 * @param {object} res
 */
function handleRoot(req, res) {
  res.sendFile(path.join(__dirname, '/public/index.html')); // Correct path to index.html
}

/**
 * List all products
 * @param {object} req
 * @param {object} res
 */
async function listProducts(req, res) {
  // Extract the limit and offset query parameters
  const { offset = 0, limit = 25, tag } = req.query;
  // Pass the limit and offset to the Products service
  try {
    const products = await Products.list({
      offset: Number(offset),
      limit: Number(limit),
      tag,
    });
    res.json(products);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Failed to list products' });
  }
}

/**
 * Get a single product
 * @param {object} req
 * @param {object} res
 */
async function getProduct(req, res, next) {
  const { id } = req.params;

  try {
    const product = await Products.get(id);
    if (!product) {
      return res.status(404).json({ error: 'Product not found' }); // Proper 404 handling
    }

    return res.json(product);
  } catch (error) {
    next(error); // Pass errors to the error handler
  }
}

// api.js
/**
 * Create a new product
 * @param {object} req
 * @param {object} res
 */
async function createProduct (req, res) {
  console.log('request body:', req.body)
  res.json(req.body)
}

/**
 * Delete a product
 * @param {object} req
 * @param {object} res
 */
async function deleteProduct(req, res) {
  const { id } = req.params;
  try {
      const result = await Products.remove(id);
      res.status(204).json(result); // 204 No Content is more appropriate for delete
  } catch (error) {
      console.error(error);
      res.status(500).json({ error: 'Failed to delete product' });
  }
}

/**
 * Update a product
 * @param {object} req
 * @param {object} res
 */
async function updateProduct(req, res) {
  const { id } = req.params;
  try {
      const updatedProduct = await Products.update(id, req.body);
      res.status(200).json(updatedProduct);
  } catch (error) {
      console.error(error);
      res.status(500).json({ error: 'Failed to update product' });
  }
}

module.exports = { // No need for autoCatch in this simplified version
  handleRoot,
  listProducts,
  getProduct,
  createProduct,
  deleteProduct,
  updateProduct,
};
