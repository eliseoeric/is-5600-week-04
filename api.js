const path = require('path')
const Products = require("./products");
const autoCatch = require("./lib/auto-catch");
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
    // Pass the limit and offset to the Products service
    res.json(await Products.list({
      offset: Number(offset),
      limit: Number(limit),
      tag,
    }))
  } catch (err) {
    res.status(500).json({ error: err.message })
  }
}

async function getProduct(req, res, next) {
    const { id } = req.params;
    try {
        const product = await Products.get(id)
        if (!product) {
          return next()
        }
    
        return res.json(product)
      } catch (err) {
        res.status(500).json({ error: err.message })
      }
    }

    async function createProduct(req, res) {
        console.log("request body:", req.body);
        res.json(req.body);
      }

      async function deleteProduct(req, res) {
        const { id } = req.params;
        const result = await Products.deleteProduct(id); // Ensure this method returns a success/failure indicator
        if (result) {
          console.log(`Product with ID ${id} deleted`);
          res.status(202).send({ message: `Product with ID ${id} deleted` });
        } else {
          res.status(404).send({ error: `Product with ID ${id} not found` });
        }
      }
      async function editProduct(req, res) {
        const { id } = req.params;
        const productData = req.body;
        const updatedProduct = await Products.updateProduct(id, productData); // Ensure this method returns the updated product
        if (updatedProduct) {
          console.log(`Product with ID ${id} updated with data:`, productData);
          res.status(200).send({ message: `Product with ID ${id} updated`, updatedProduct });
        } else {
          res.status(404).send({ error: `Product with ID ${id} not found` });
        }
      }
      
  module.exports = autoCatch({
    handleRoot,
    listProducts,
    getProduct,
    createProduct,
  editProduct,
  deleteProduct,
  });