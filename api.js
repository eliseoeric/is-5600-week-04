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
    const { offset = 0, limit = 25, tag } = req.query;
    
    try {
      res.json(await Products.list({
        offset: Number(offset),
        limit: Number(limit),
      }))
    } catch (err) {
      res.status(500).json({ error: err.message })
    }
  }

  async function getProduct (req, res, next) {
    const { id } = req.params;
  
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

  async function createProduct (req, res) {
    console.log('request body:', req.body)
    res.json(req.body)
  }

  async function deleteProduct(req, res, next) {
    const { id } = req.params;  // Extract the 'id' from the URL params
  
    try {
      const result = await Products.delete(id);  // Call the delete method in Products service
  
      if (result) {
        console.log(`Product with id ${id} was deleted.`);
        return res.status(202).json({ message: `Product with id ${id} was deleted.` });
      } else {
        return next();  // If the product is not found, pass control to 404 handler
      }
    } catch (err) {
      res.status(500).json({ error: err.message });  // Handle any errors
    }
  }

/**
 * Update a single product
 * @param {object} req
 * @param {object} res
 */
async function updateProduct(req, res, next) {
    const { id } = req.params;  // Extract the 'id' from the URL params
    const updatedProduct = req.body;  // Get the updated product data from the request body
  
    try {
      const result = await Products.update(id, updatedProduct);  // Call the update method in Products service
  
      if (result) {
        console.log(`Product with id ${id} was updated.`);
        return res.status(200).json({ message: `Product with id ${id} was updated.` });
      } else {
        return next();  // If the product is not found, pass control to 404 handler
      }
    } catch (err) {
      res.status(500).json({ error: err.message });  // Handle any errors
    }
  }

  module.exports = autoCatch({
    handleRoot,
    listProducts,
    getProduct,
    createProduct,
    deleteProduct,
    updateProduct,
  });