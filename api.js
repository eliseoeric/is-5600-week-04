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
}
// api.js

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
  // api.js
const autoCatch = require('lib/auto-catch')

// Update the module exports
module.exports = autoCatch({
  handleRoot,
  listProducts,
  getProduct
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
  const Products = require('./products');

// Handle root route
function handleRoot(req, res) {
  res.sendFile(path.join(__dirname, '/index.html'));
}

// List all products
async function listProducts(req, res) {
  try {
    const products = await Products.list(req.query);
    res.json(products);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
}

// Get a single product by ID
async function getProduct(req, res) {
  try {
    const product = await Products.get(req.params.id);
    if (product) {
      res.json(product);
    } else {
      res.status(404).json({ error: 'Product not found' });
    }
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
}

// Delete a product
async function deleteProduct(req, res) {
  try {
    const result = await Products.deleteProduct(req.params.id);
    res.status(202).json(result); // 202 Accepted
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
}

// Update a product
async function updateProduct(req, res) {
  try {
    const result = await Products.updateProduct(req.params.id, req.body);
    res.status(200).json(result); // 200 OK
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
}

module.exports = {
  handleRoot,
  listProducts,
  getProduct,
  deleteProduct,
  updateProduct
};
