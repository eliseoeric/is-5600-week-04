const express = require('express')
const path = require('path')
const bodyParser = require('body-parser')

// Import modules
const api = require('./api')
const middleware = require('./api/middleware')

// Set the port
const port = process.env.PORT || 3000

// Boot the app
const app = express()

// Register middleware globally
app.use(middleware.cors)
app.use(bodyParser.json()) // Parse JSON request bodies

// Register the public directory
app.use(express.static(__dirname + '/public'));

// Register routes
app.get('/', api.handleRoot)
app.get('/products', api.listProducts)
app.get('/products/:id', api.getProduct)
app.post('/products', api.createProduct) 

// ✅ Add DELETE and PUT routes
app.delete('/products/:id', api.deleteProduct)
app.put('/products/:id', api.updateProduct)

// Handle 404 responses
app.use(middleware.notFound)

// Handle errors globally
app.use(middleware.handleError)

// Boot the server
app.listen(port, () => console.log(`Server listening on port ${port}`))
