// Importing required modules
const fs = require('fs').promises // for file operations (async)
const path = require('path')      // for handling file paths
const express = require('express') // web framework

// Set the port number
const port = process.env.PORT || 3000

// Create express app
const app = express()

// Serve static files from 'public' folder
app.use(express.static(__dirname + '/public'))

// Routes
app.get('/products', listProducts) // API endpoint to get products
app.get('/', handleRoot)           // route for home page

// Start server
app.listen(port, () => console.log(`Server listening on port ${port}`))

// Handle root route -> send index.html file
function handleRoot(req, res) {
  // send the homepage
  res.sendFile(path.join(__dirname, '/index.html'))
}

// Function to list products with pagination
async function listProducts(req, res) {
  const productsFile = path.join(__dirname, 'data/full-products.json') // path to JSON file

  // Get query params for pagination, default offset=0, limit=20
  const offset = parseInt(req.query.offset || 0)
  const limit = parseInt(req.query.limit || 20)

  try {
    // read the JSON file
    const data = await fs.readFile(productsFile)
    const allProducts = JSON.parse(data) // parse JSON data

    // slice array according to offset and limit
    const paginated = allProducts.slice(offset, offset + limit)

    // send paginated products as JSON response
    res.json(paginated)
  } catch (err) {
    // if any error occurs, send 500 with error message
    res.status(500).json({ error: err.message })
  }
}
