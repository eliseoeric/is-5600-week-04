const path = require('path')
const Products = require('./products');
const autoCatch = require('../lib/auto-catch')

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

    try {
        res.json(await Products.list({

            offset: Number(offset),
            limit: Number(limit),
            tag,
      }))
    } catch (err) {
      res.status(500).json({ error: err.message })
    }
}

async function getProduct (req, res, next) {

    res.setHeader('Access-Control-Allow-Origin', '*')
    try {
        const product = await Products.get(id)
        if (!product){
            return next()
        }      
      } catch (err) {
        res.status(500).json({ error: err.message })
      }
}
async function createProduct (req, res) {
    console.log('request body:', req.body)
    res.json(req.body)
  }
async function deleteProduct(req, res) {
    const { id } = req.params; 
    try {
        console.log(`Product with id ${id} was deleted.`);
        res.status(202).json({ message: 'Product deleted successfully' });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
}

async function updateProduct(req, res) {
  const { id } = req.params;  // Get the 'id' from req.params
  const productData = req.body;  // Get the updated product data from the request body
  try {
      // Log the update action (since we're not really updating data yet)
      console.log(`Product with id ${id} was updated with new data:`, productData);

      // Send a 200 response indicating the product is "updated"
      res.status(200).json({ message: 'Product updated successfully' });
  } catch (err) {
      res.status(500).json({ error: err.message });
  }
}

module.exports = autoCatch({
    handleRoot,
    listProducts,
    getProduct,
    createProduct,
    deleteProduct,
    updateProduct
  });
  