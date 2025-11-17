const fs = require('fs').promises
const path = require('path')
const express = require('express')
const api = require('./api')
const middleware = require('./middleware')
const bodyParser = require('body-parser')

// Set the port
const port = process.env.PORT || 3000
// Boot the app
const port = process.env.PORT || 3000 // Set the port
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
app.use(express.static(__dirname + '/public')) // Serve static files from the "public" directory
app.use(middleware.cors) // Enable CORS
app.use(bodyParser.json()) // Parse JSON request bodies

/**
 * List all products
 * @param {object} req
 * @param {object} res
 */
async function listProducts(req, res) {
  const productsFile = path.join(__dirname, 'data/full-products.json')
  try {
    const data = await fs.readFile(productsFile)
    res.json(JSON.parse(data))
  } catch (err) {
    res.status(500).json({ error: err.message })
  }
} 
// Defining all the routes
app.get('/products', api.listProducts) // Get all products
app.get('/', api.handleRoot) // Serve the root page
app.get('/products/:id', api.getProduct) // Get a product by ID
app.post('/products', api.createProduct) // Create a new product
app.delete('/products/:id', api.deleteProduct) // Delete a product by ID
app.put('/products/:id', api.updateProduct) // Update a product by ID

app.use(middleware.notFound) // Handle 404 errors
app.use(middleware.handleError) // Handle other errors

app.listen(port, () => console.log(`Server listening on port ${port}`)) // Start the server