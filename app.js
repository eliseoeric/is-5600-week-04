const express = require('express')
const api = require('./api')
const middleware = require('./middleware')

// Set up the express app
const app = express()
const port = 3000

// Register middleware
app.use(middleware.cors)
app.use(express.json()) // Use Express's built-in JSON parser instead of body-parser

// Setup API routes FIRST (before static files)
app.get('/products', api.listProducts)
app.get('/products/:id', api.getProduct)
app.post('/products', api.createProduct)
app.put('/products/:id', api.updateProduct)
app.delete('/products/:id', api.deleteProduct)

// Root route - serves index.html
app.get('/', api.handleRoot)

// Serve static files from public directory (AFTER routes)
app.use(express.static('public'))

// Error handling middleware (must be last)
app.use(middleware.handleError)
app.use(middleware.notFound)

// Start the server
app.listen(port, () => {
  console.log(`Server is running on http://localhost:${port}`)
})

module.exports = app