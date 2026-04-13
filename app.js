// app.js
const express = require('express')
const path = require('path')
const bodyParser = require('body-parser')

const api = require('./api')
const middleware = require('./middleware')

const app = express()

// Serve static files from the public directory
app.use(express.static(path.join(__dirname, 'public')))

// Register middleware
app.use(middleware.cors)
app.use(bodyParser.json())

// Register routes
app.get('/', api.handleRoot)
app.get('/products', api.listProducts)
app.get('/products/:id', api.getProduct)
app.post('/products', api.createProduct)
app.put('/products/:id', api.updateProduct)
app.delete('/products/:id', api.deleteProduct)

// Error handling middleware (must be last)
app.use(middleware.notFound)
app.use(middleware.handleError)

// Start the server
app.listen(3000, () => {
  console.log('Server is running on port 3000')
})

module.exports = app