// app.js
const fs = require('fs').promises
const path = require('path')
const express = require('express')

// Set the port
const port = process.env.PORT || 3000
// Boot the app
const app = express()

// Register the public directory
app.use(express.static(__dirname + '/public'))

// Add middleware
const middleware = require('./middleware')
const bodyParser = require('body-parser')

// Add the api module
const api = require('./api')

// Register middleware
app.use(middleware.cors)
app.use(bodyParser.json())

// Routes
app.get('/', api.handleRoot)
app.get('/products', api.listProducts)
app.get('/products/:id', api.getProduct)

// New Required Routes
app.post('/products', api.createProduct)
app.put('/products/:id', api.updateProduct)
app.delete('/products/:id', api.deleteProduct)

// 404 middleware
app.use(middleware.notFound)
// Error middleware
app.use(middleware.handleError)

// Boot the server
app.listen(port, () => console.log(`Server listening on port ${port}`))
