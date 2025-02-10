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

    const { offset = 0, limit = 25, tag } = req.query

    res.json(await Products.list({
      offset: Number(offset),
      limit: Number(limit),
      tag,
    }))
  }


async function getProduct (req, res, next) {
    // Add CORS headers
    res.setHeader('Access-Control-Allow-Origin', '*')
  
    const { id } = req.params
  
    const product = await Products.get(id)
    if (!product) {
      return next()
    }

    return res.json(product)
}

async function createProduct (req, res) {
    console.log('request body:', req.body)
    res.json(req.body)
}

async function updateProduct(req, res) {
    const { id } = req.params;
    const updatedData = req.body;
  
    
    const updatedProduct = await Products.update(id, updatedData);
    if (!updatedProduct) {
      return res.status(404).json({ error: 'Product not found' });
    }
    res.json(updatedProduct);
  
  }

  async function deleteProduct(req, res) {
    const { id } = req.params;
  
    
    const deleted = await Products.remove(id);
    if (!deleted) {
      return res.status(404).json({ error: 'Product not found' });
    }
    res.json({ message: 'Product deleted successfully' });

  }

  module.exports = autoCatch({
    handleRoot,
    listProducts,
    getProduct,
    createProduct,
    updateProduct,
    deleteProduct,
  });