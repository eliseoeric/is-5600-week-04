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

async function listProducts(req, res) {
     // Add CORS headers
 // res.setHeader('Access-Control-Allow-Origin', '*')

  const { offset = 0, limit = 25, tag } = req.query

  try {
    res.json(await Products.list({
        offset: Number(offset),
        limit: Number(limit),
        tag,
    }))
  } catch (err) {
    res.status(500).json({ error: err.message })
  }
}

async function getProduct(req, res, next) {
  //res.setHeader('Access-Control-Allow-Origin', '*')
  const { id } = req.params

  try {
    // Require Products dynamically to avoid circular dependency
    const Products = require('./products')
    const product = await Products.get(id)
    if (!product) {
      return next()
    }
    return res.json(product)
  } catch (err) {
    res.status(500).json({ error: err.message })
  }
}

async function createProduct (req, res) {
  console.log('request body:', req.body)
  res.json(req.body)
}

async function deleteProduct(req, res) {
  const { id } = req.params;
  res.status(202).json({ message: `Product with ID ${id} has been deleted.` });
}

async function updateProduct(req, res) {
  const { id } = req.params;
  res.status(200).json({ message: `Product with ID ${id} has been updated.`});
}

 module.exports = autoCatch({
  handleRoot,
  listProducts,
  getProduct,
  createProduct,
  updateProduct,
  deleteProduct,
 });


