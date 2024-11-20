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


  // Extract the limit and offset query parameters
  const { offset = 0, limit = 25 , tag} = req.query

try {
    // Pass the limit and offset to the Products service
    res.json(await Products.list({
      offset: Number(offset),
      limit: Number(limit)
    }))
  } catch (err) {
    res.status(500).json({ error: err.message })
  }
}

// api.js


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

module.exports = {
  handleRoot,
  listProducts,
  getProduct
}

  
