// api.js
const path = require('path')

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
  
  // Read the products file
  const productsFile = path.join(__dirname, 'data/full-products.json')
  
  try {
    const data = await fs.readFile(productsFile)
    res.json(JSON.parse(data))
  } catch (err) {
    res.status(500).json({ error: err.message })
  }
}

module.exports = {
  handleRoot,
  listProducts
}
// api.js
const Products = require('./products')

// ...

/**
 * List all products
 * @param {object} req
 * @param {object} res
 */
async function listProducts (req, res) {
  try {
    res.json(await Products.list()) // Use the Products service
  } catch (err) {
    res.status(500).json({ error: err.message })
  }
}// api.js

/**
 * List all products
 * @param {object} req
 * @param {object} res
 */
async function listProducts (req, res) {

    // Extract the limit and offset query parameters
    const { offset = 0, limit = 25 } = req.query
  
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

// update the module exports
module.exports = {
    handleRoot,
    listProducts,
    getProduct
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
  // products.js

/**
 * Get a single product
 * @param {string} id
 * @returns {Promise<object>}
 */
async function get (id) {
    const products = JSON.parse(await fs.readFile(productsFile))
  
    // Loop through the products and return the product with the matching id
    for (let i = 0; i < products.length; i++) {
      if (products[i].id === id) {
        return products[i]
      }
    }
  
     // If no product is found, return null
    return null;
  }
  // app.js
// Require the middleware module
const middleware = require('middleware')

// Register our upcoming middleware
app.use(middleware.cors)
app.get('/', api.handleRoot)
app.get('/products', api.listProducts)
app.get('/products/:id', api.getProduct)
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