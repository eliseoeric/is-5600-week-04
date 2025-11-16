const fs = require('fs').promises

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

/**
 * Handle the root route
 * @param {object} req
 * @param {object} res
*/
function handleRoot(req, res) {
  res.sendFile(path.join(__dirname, '/index.html'));
}

const productsFile = path.join(__dirname, 'data/full-products.json')




/**
 * List all products
 * @param {object} req
 * @param {object} res
 * @returns {Promise<Array>}
 */
async function listProducts(req, res) {
  const productsFile = path.join(__dirname, 'data/full-products.json')
  try {
async function list (options = {}) {
    const { offset = 0, limit = 25, tag } = options
    const data = await fs.readFile(productsFile)
    res.json(JSON.parse(data))
  }
 } catch (err) {
    res.status(500).json({ error: err.message })

    return JSON.parse(data)
    .filter(product => {
        if (!tag){
            return product
        }

        return product.tags.find(({title}) => title = tag)
    })
    .slice(offset, offset + limit) // Slice the products
  }

async function get (id) {
    const products = JSON.parse(await fs.readFile(productsFile))

    // Loop through the products and return the product with the matching id
    for (let i = 0; i < products.length; i++) {
      if (products[i].id === id) {
        return products[i]
      }
    }

     // If no product is found, return null
    return null;
  }

  module.exports = {
    list,
    get
  }
  }