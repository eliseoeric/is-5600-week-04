//Needed imports
const express = require('express')
const api = require('./api')
const middleware = require('./middleware')
const bodyParser = require('body-parser')

// Port number allocation
const port = process.env.PORT || 3000
const app = express()
app.use(express.static(__dirname + '/public'));

// Routes definition
app.use(middleware.cors)
app.use(bodyParser.json())
app.get('/products', api.listProducts)
app.get('/', api.handleRoot);
app.get('/products/:id', api.getProduct)
app.post('/products', api.createProduct)
app.delete('/products/:id', api.deleteProduct);
app.put('/products/:id', api.updateProduct);
app.use(middleware.notFound)
app.use(middleware.handleError)
app.listen(port, () => console.log(`Server listening on port ${port}`))