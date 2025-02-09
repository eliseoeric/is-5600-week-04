const fs = require('fs').promises
const express = require('express')
const bodyParser = require('body-parser')
const api = require('./api')
const middleware = require('./middleware')
// Set the port
const port = process.env.PORT || 3000
// Boot the app
const app = express()
// Register the public directory
app.use(express.static(__dirname + '/public'));
app.use(bodyParser.json())
app.use(middleware.cors)
// Error Handling
app.use(middleware.notFound);
app.use(middleware.handleError);

// register the routes
app.get('/products', api.listProducts)
app.get('/', api.handleRoot)
app.get('/products/:id', api.getProduct)
app.post('/products', api.createProduct)
app.put('/products/:id', api.updateProduct)
app.delete('/products/:id', api.deleteProduct)

// Boot the server
app.listen(port, () => console.log(`Server listening on port ${port}`));