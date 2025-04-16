const fs = require('fs').promises
const path = require('path')
const express = require('express')
const bodyParser = require('body-parser')

// Require modules
const api = require('./api')
const middleware = require('./middleware')

// Set the port
const port = process.env.PORT || 3000
// Boot the app
const app = express()
// Register the public directory
app.use(express.static(__dirname + '/public'));

// Register middleware
app.use(middleware.cors)
app.use(bodyParser.json())

// Register routes
app.get('/', api.handleRoot)
app.get('/products', api.listProducts)
app.get('/products/:id', api.getProduct)
app.post('/products', api.createProduct)
// Add the PUT route to update a product
app.put('/products/:id', api.updateProduct)
// Add the DELETE route to delete a product
app.delete('/products/:id', api.deleteProduct)

// Register error handling middleware
app.use(middleware.notFound)
app.use(middleware.handleError)

// Boot the server
app.listen(port, () => console.log(`Server listening on port ${port}`))