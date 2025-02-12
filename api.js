const fs = require('fs').promises
const path = require('path')
const Products = require('./products')
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
    res.setHeader('Access-Control-Allow-Origin', '*')
    const { offset = 0, limit = 25, tag } = req.query;
    try {
      res.json(await productsFile.list({
        offset: Number(offset),
      limit: Number(limit),
      tag,
    }))
    } catch (err) {
      res.status(500).json({ error: err.message })
    }
  }
module.exports = {
    handleRoot,
    listProducts,
}
