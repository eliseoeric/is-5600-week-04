const fs = require('fs').promises
const path = require('path')
const Products = require('./products')
const autoCatch = require('./lib/auto-catch')

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
async function listProducts (req, res) {
    // Extract the limit and offset query parameters
    const { offset = 0, limit = 25, tag } = req.query;

    try {
      // Pass the limit and offset to the Products service
      res.json(await Products.list({
        offset: Number(offset),
        limit: Number(limit),
        tag,
      }))
    } catch (err) {
      res.status(500).json({ error: err.message })
    }
}

/**
 * Get a single product
 * @param {object} req
 * @param {object} res
 */
async function getProduct (req, res, next) {
    const { id } = req.params

    try {
      const product = await Products.get(id)
      if (!product) {
        // next() is a callback that will pass the request to the next available route in the stack
        return next()
      }

      return res.json(product)
    } catch (err) {
      res.status(500).json({ error: err.message })
    }
}

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
 * Update a product
 * @param {object} req
 * @param {object} res
 */
async function updateProduct(req, res) {
    const { id } = req.params;
    const data = req.body;

    try {
        const updatedProduct = await Products.update(id, data);
        res.json(updatedProduct);
    } catch (err) {
        res.status(404).json({ error: err.message });
    }
}

/**
 * Delete a product
 * @param {object} req
 * @param {object} res
 */
async function deleteProduct(req, res) {
    const { id } = req.params;

    try {
        await Products.remove(id);
        res.status(200).send('Product deleted successfully');
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
    deleteProduct
});