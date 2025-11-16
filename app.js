const express = require('express')
const bodyParser = require('body-parser')

// Add the api module
const api = require('./api')
// Require the middleware module
const middleware = require('./middleware')

// Set the port
const port = process.env.PORT || 3000
// Boot the app
const app = express()

// Register the public directory
app.use(express.static(__dirname + '/public'));

// Register our middleware
app.use(middleware.cors)
app.use(bodyParser.json())

// Register the routes
app.get('/', api.handleRoot)
app.get('/products', api.listProducts)
app.get('/products/:id', api.getProduct)
app.post('/products', api.createProduct)
app.delete('/products/:id', api.deleteProduct)
app.put('/products/:id', api.updateProduct)

// Error handling middleware (must be last)
app.use(middleware.notFound)
app.use(middleware.handleError)

// Boot the server
app.listen(port, () => console.log(`Server listening on port ${port}`))