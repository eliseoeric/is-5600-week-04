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
        tag,
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
            return next()
        }

        return res.json(product)

    } catch (err) {
        res.status(500).json({ error: err.message })
    }

}

async function createProduct (req, res) {
    console.log('request body', req.body)
    res.json(req.body)
}

async function deleteProduct(req, res, next) {
    try {
      console.log('Request body:', req.body);
      // const result = await Product.deleteOne({ _id: req.params.id });
      res.status(200).json({ success: true, data: req.body });
    } catch (error) {
      next(error);
    }
  }

  async function updateProduct(req, res, next) {
    try {
      console.log('Request body:', req.body)
      // const updatedProduct = await Products.update(req.params.id, req.body)
      res.status(200).json({ success: true, data: req.body })
    } catch (error) {
      next(error)
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