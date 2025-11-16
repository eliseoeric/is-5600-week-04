const fs = require('fs').promises
const path = require('path')
const express = require('express')
const bodyParser = require('body-parser')
const api = require('./api')
const middleware = require('./middleware')

// Set the port
const port = process.env.PORT || 3000
// Boot the app
const app = express()
// app.use(express.json());

app.use(express.static(__dirname + '/public'));

// Boot the server
app.listen(port, () => console.log(`Server listening on port ${port}`))

app.use(middleware.cors)
app.use(bodyParser.json())

app.get('/', api.handleRoot)
app.get('/products', api.listProducts)
app.get('/products/:id', api.getProduct)
app.post('/products', api.createProduct)
app.delete('/products/:id', api.deleteProduct);
app.put('/products/:id', api.updateProduct);

app.use(middleware.handleError);
app.use(middleware.notFound);