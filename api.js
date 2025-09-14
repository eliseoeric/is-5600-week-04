const fs = require('fs').promises
const path = require('path')
const Products=require('./product')
 /**
 * Handle the root route
 * @param {object} req
 * @param {object} res
*/
function handleRoot (req, res) {
  res.sendFile(path.join(__dirname, '/index.html'));
}

/**
 * List all products
 * @param {object} req
 * @param {object} res
 */
async function listProducts (req, res) {
  // Extract the limit and offset query parameters
  const { offset = 0, limit = 25 ,tag} = req.query
  try {
    res.json(await Products.list({
      offset: Number(offset),
      limit: Number(limit),
      tag,
    }))// Use the Products service
  } catch (err) {
    res.status(500).json({ error: err.message })
  }
}

module.exports = {
  handleRoot,
  listProducts,
  getProduct,
  deleteProduct,
  updateProduct
}
/**
 * Update a product (API handler)
 * @param {object} req
 * @param {object} res
 */
async function updateProduct(req, res) {
  const { id } = req.params;
  const data = req.body;
  await Products.updateProduct(id, data);
  res.status(200).json({ message: `Product with id ${id} updated (placeholder)` });
}
/**
 * Delete a product (API handler)
 * @param {object} req
 * @param {object} res
 */
async function deleteProduct(req, res) {
  const { id } = req.params;
  await Products.deleteProduct(id);
  res.status(202).json({ message: `Product with id ${id} deleted (placeholder)` });
}
/**
 * Get a single product
 * @param {object} req
 * @param {object} res
 */
async function getProduct (req, res, next) {
  // Add CORS headers
  res.setHeader('Access-Control-Allow-Origin', '*')

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
// api.js


const autoCatch = require('./lib/auto-catch');
module.exports = autoCatch({
  handleRoot,
  listProducts,
  getProduct,
  deleteProduct,
  updateProduct,
  createProduct
});

// Remove the try/catch from the api methods

/**
 * List all products
 * @param {object} req
 * @param {object} res
 */
async function listProducts (req, res) {
  // Extract the limit and offset query parameters
  const { offset = 0, limit = 25, tag } = req.query
  // Pass the limit and offset to the Products service
  res.json(await Products.list({
    offset: Number(offset),
    limit: Number(limit),
    tag
  }))
}

/**
 * Get a single product
 * @param {object} req
 * @param {object} res
 */
async function getProduct (req, res, next) {
  const { id } = req.params

  const product = await Products.get(id)
  if (!product) {
    return next()
  }
  
  return res.json(product)
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