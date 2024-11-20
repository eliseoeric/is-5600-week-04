// api.js
const fs = require('fs').promises
const path = require('path')
const Products = require('./products')


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
  // Add CORS headers
  res.setHeader('Access-Control-Allow-Origin', '*')
  
  
  try {
    res.json(await Products.list()) // Use the Products service
  } catch (err) {
    res.status(500).json({ error: err.message })
  }
}

module.exports = {
  handleRoot,
  listProducts
}

  
