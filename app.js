@@ -1,25 +1,15 @@
const fs = require('fs').promises
// api.js

const path = require('path')
const express = require('express')

// Set the port
const port = process.env.PORT || 3000
// Boot the app
const app = express()
// Register the public directory
app.use(express.static(__dirname + '/public'));
// register the routes
app.get('/products', listProducts)
app.get('/', handleRoot);
// Boot the server
app.listen(port, () => console.log(`Server listening on port ${port}`))
const Products = require('./products')
const autoCatch = require('./lib/auto-catch')

/**
 /**
 * Handle the root route
 * @param {object} req
 * @param {object} res
*/
function handleRoot(req, res) {
function handleRoot (req, res) {
  res.sendFile(path.join(__dirname, '/index.html'));
}

@@ -28,12 +18,46 @@ function handleRoot(req, res) {
 * @param {object} req
 * @param {object} res
 */
async function listProducts(req, res) {
  const productsFile = path.join(__dirname, 'data/full-products.json')
async function listProducts (req, res) {

  const { offset = 0, limit = 25 ,tag} = req.query

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

async function getProduct (req, res, next) {

  const { id } = req.params

  try {
    const data = await fs.readFile(productsFile)
    res.json(JSON.parse(data))
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
}
async function createProduct (req, res) {
  console.log('request body:', req.body)
  res.json(req.body)
}

module.exports = autoCatch({
  handleRoot,
  listProducts,
  getProduct,
  createProduct,
});