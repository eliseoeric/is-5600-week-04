const express = require('express')
const bodyParser = require('body-parser')
const api = require('./api')
const middleware = require('./middleware')

// Set the port
const port = process.env.PORT || 3000

// Boot the app
const app = express()

// Register the public directory for serving static frontend files
app.use(express.static(__dirname + '/public'))

// Register middleware
app.use(middleware.cors)
app.use(bodyParser.json())

// Register the routes
app.get('/', api.handleRoot)
app.get('/products', api.listProducts)
app.get('/products/:id', api.getProduct)
app.post('/products', api.createProduct)
app.put('/products/:id', api.updateProduct)
app.delete('/products/:id', api.deleteProduct)

// Register final error handling and 404 middleware
// These must be registered after all the routes!
app.use(middleware.notFound)
app.use(middleware.handleError)

// Boot the server
app.listen(port, () => console.log(`Server listening on port ${port}`))