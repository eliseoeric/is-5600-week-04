const fs = require('fs').promises
const path = require('path')
const express = require('express')
const bodyParser = require('body-parser')

const middleware = require('./middleware')
const api = require('./api')

// Set the port
const port = process.env.PORT || 3000
// Boot the app
const app = express()
// Register the public directory
app.use(express.static(__dirname + '/public'));

app.use(middleware.cors)
app.use(bodyParser.json())
// register the routes
app.get('/products', api.listProducts)
app.get('/', api.handleRoot);
app.get('/products/:id', api.getProduct)
app.post('/products', api.createProduct)
app.delete('/products/:id', api.deleteProduct)
app.put('/products/:id', api.updateProduct)

// Boot the server
app.listen(port, () => console.log(`Server listening on port ${port}`))

// Register the error handler
app.use(middleware.handleError)
// Register the not found handler
app.use(middleware.notFound)