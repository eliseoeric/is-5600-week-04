const fs = require('fs').promises
const path = require('path')
const Products = require('./products');
const autoCatch = require('./lib/auto-catch')



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
    const { offset = 0, limit = 25, tag } = req.query
    // Pass the limit and offset to the Products service
    res.json(await Products.list({
      offset: Number(offset),
      limit: Number(limit),
      tag
    }))
  }

  async function getProduct (req, res, next) {
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

  async function deleteProduct(req, res, next) {
    const { id } = req.params;
  
    const result = await Products.remove(id);
    if (!result) {
      // If the product was not found, send a 404 response
      return res.status(404).json({ error: 'Product not found' });
    }
  
    // If the product was "deleted", send a success response
    res.json({ success: true, message: 'Product deleted successfully (simulation)' });
  }

  async function updateProduct(req, res) {
    const { id } = req.params;
    const productData = req.body;
  
    // Call the update method from products.js
    const result = await Products.update(id, productData);
  
    if (!result) {
      // If the product was not found or update failed
      return res.status(404).json({ error: 'Product not found or update failed' });
    }
  
    // Return a 200 response indicating success
    res.status(200).json({ success: true, message: 'Product updated successfully (simulation)' });
  }

  module.exports = autoCatch({
    handleRoot,
    listProducts,
    getProduct,
    createProduct,
    deleteProduct,
    updateProduct
    
  });