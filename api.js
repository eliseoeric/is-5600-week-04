// api.js
const path = require('path')
const fs = require('fs').promises

/**
 * Handle the root route
 */
function handleRoot(req, res) {
  res.sendFile(path.join(__dirname, '/index.html'))
}

/**
 * List all products
 */
async function listProducts(req, res) {
  // Add CORS header for now (we’ll move to middleware later)
  res.setHeader('Access-Control-Allow-Origin', '*')

  const productsFile = path.join(__dirname, 'data/full-products.json')

  try {
    const data = await fs.readFile(productsFile)
    res.json(JSON.parse(data))
  } catch (err) {
    res.status(500).json({ error: err.message })
  }
}

module.exports = { handleRoot, listProducts }
