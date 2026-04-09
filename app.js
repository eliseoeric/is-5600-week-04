const express = require('express')
const bodyParser = require('body-parser')

// Add the api module and middleware
const api = require('./api')
const middleware = require('./middleware')

// Boot the app
const app = express()

// Set the port
const port = process.env.PORT || 3000

// Register our middleware
app.use(middleware.cors)
app.use(bodyParser.json())

// Register the public directory
app.use(express.static(__dirname + '/public'))

// update the route handlers
app.get('/', api.handleRoot)
app.get('/products', api.listProducts)
app.get('/products/:id', api.getProduct)
app.post('/products', api.createProduct)
app.put('/products/:id', api.updateProduct)
app.delete('/products/:id', api.deleteProduct)

// Register error handling and not found middleware
app.use(middleware.notFound)
app.use(middleware.handleError)

// Boot the server
app.listen(port, () => console.log(`Server listening on port ${port}`))