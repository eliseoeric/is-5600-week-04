const fs = require('fs').promises
const path = require('path')
const express = require('express')
const api = require('./api')
const middleware = require('./middleware')
// Set the port
const port = process.env.PORT || 3000
// Boot the app
const app = express()
// Register the public directory
app.use(express.static(__dirname + '/public'));
// Add JSON body parser for PUT/POST requests
app.use(express.json());
// Register CORS middleware early
app.use(middleware.cors);
// register the routes
app.get('/products', api.listProducts)
app.get('/', api.handleRoot);
app.get('/products/:id', api.getProduct)
app.put('/products/:id', api.updateProduct)
app.delete('/products/:id', api.deleteProduct)
// app.use(middleware.cors)
// app.use(bodyParser.json())
app.post('/products', api.createProduct)


// Register our upcoming middleware
// app.use(middleware.cors)
// app.get('/', api.handleRoot)
// app.get('/products', api.listProducts)
// app.get('/products/:id', api.getProduct)
// Boot the server
app.listen(port, () => console.log(`Server listening on port ${port}`))

