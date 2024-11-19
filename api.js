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
    const { offset = 0, limit = 25,tag } = req.query
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

    /**
 * Create a new product
 * @param {object} req
 * @param {object} res
 */
async function createProduct (req, res) {
    console.log('request body:', req.body)
    res.json(req.body)
  }

   /**
 * Deleting the product
 * @param {object} req
 * @param {object} res
 */
  async function deleteProduct(req, res) {
    const { id } = req.params;
    res.status(202).json({ message: `Product with ID ${id} has been deleted.` });
  }

   /**
 * Updating the product
 * @param {object} req
 * @param {object} res
 */
  async function updateProduct(req, res) {
    const { id } = req.params;
    res.status(200).json({ message: `Product with ID ${id} has been updated.`});
  }
  
  module.exports = {
    handleRoot,
    listProducts,
    getProduct,
    createProduct,
    deleteProduct,
    updateProduct
  }