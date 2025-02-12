// api.js
const path = require('path')
const Products = require('./products')
const autoCatch = require('./lib/auto-catch')
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

  module.exports = autoCatch({
    handleRoot,
    listProducts,
    getProduct,
    createProduct,
    deleteProduct,
    updateProduct
  });

  async function createProduct (req, res) {
    console.log('request body:', req.body)
    res.json(req.body)
  }
  async function deleteProduct(req, res) {
    const { id } = req.params
    await Products.delete(id) // Call the Products service to handle delete logic
    console.log(`Product with ID ${id} deleted`)
    res.status(202).json({ message: "Product deleted successfully" })
  }
  async function updateProduct(req, res) {
    const { id } = req.params
    await Products.update(id, req.body) // Call the Products service to handle update logic
    console.log(`Product with ID ${id} updated`)
    res.status(200).json({ message: "Product updated successfully" })
  }