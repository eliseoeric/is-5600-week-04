const express = require('express')
const api = require('.api')
const middleware = require('middleware')

// Set the port
const port = process.env.PORT || 3000
// Boot the app
const app = express()
// Register the public directory
app.use(express.static(__dirname + '/public'));
// register the routes
app.use(middleware.cors)
app.get('/products', api.listProducts)
app.get('/', api.handleRoot);
app.get('/product/:id',api.getProduct)
// Boot the server
app.listen(port, () => console.log(`Server listening on port ${port}`))

