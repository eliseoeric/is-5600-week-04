const fs = require('fs').promises
const path = require('path')
const express = require('express')
const bodyParser = require('body-parser')
const middleware = require('./middleware')
const api=require('./api')


// Set the port
const port = process.env.PORT || 3000
// Boot the app
const app = express()
// Register the public directory
app.use(express.static(__dirname + '/public'));

// Require the middleware module

// Register our upcoming middleware
app.use(middleware.cors)
app.use(bodyParser.json())
app.get('/', api.handleRoot)
app.get('/products', api.listProducts)
app.get('/products/:id', api.getProduct)
app.post('/products', api.createProduct)
app.delete('/deleteProduct/:id',api.deleteProduct)
app.put('/updateProduct/:id',api.updateProduct)


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

/**
 * List all products
 * @param {object} req
 * @param {object} res
 */
async function listProducts (req, res) {
  try {
    res.json(await Products.list()) // Use the Products service
  } catch (err) {
    res.status(500).json({ error: err.message })
  }
}
