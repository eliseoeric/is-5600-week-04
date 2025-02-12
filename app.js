const fs = require('fs').promises
const path = require('path')
const express = require('express')
const api = require('./api')
const middleware = require('./middleware.js')
const bodyParser = require('body-parser')

// Set the port
const port = process.env.PORT || 3001
// Boot the app
const app = express()
// Register the public directory
app.use(express.static(__dirname + '/public'));

// register the routes

app.use(middleware.cors)
//app.use(middleware.notFound)
app.use(bodyParser.json())
app.get('/products', api.listProducts)
app.get('/', api.handleRoot);
app.get('/products/:id', api.getProduct)
app.use(middleware.handleError)
//app.use(middleware.notFound)
app.post('/products', api.createProduct)
app.put('/products/:id', api.updateProduct)
app.delete('/products/:id', api.deleteProduct);
// Boot the server
app.listen(port, () => console.log(`Server listening on port ${port}`))
