// app.js
const express = require('express')
const bodyParser = require('body-parser')
const path = require('path')

// Add the api module
const api = require('./api')

// Require the middleware module
const middleware = require('./middleware')

const app = express()

// Register our upcoming middleware
app.use(middleware.cors)

// Add body parser middleware
app.use(bodyParser.json())

// Configures the public directory for our node server to listen for static files
app.use(express.static(path.join(__dirname, 'public')))

// update the route handlers
app.get('/', api.handleRoot)
app.get('/products', api.listProducts)
app.get('/products/:id', api.getProduct)
app.post('/products', api.createProduct)
app.put('/products/:id', api.updateProduct)
app.delete('/products/:id', api.deleteProduct)

// Error handling middleware - must be registered last
app.use(middleware.notFound)
app.use(middleware.handleError)

// Sets up the server to listen on port 3000
app.listen(3000, () => {
  console.log('Server is running on http://localhost:3000')
})

module.exports = app