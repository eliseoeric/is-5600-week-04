const express = require('express')
const api = require('./api')
const middleware = require('./middleware')
const bodyParser = require('body-parser')
const port = process.env.PORT || 3000
const app = express()

app.use(express.static(__dirname + '/public'));
app.use(middleware.cors)
app.use(bodyParser.json())
app.get('/', api.handleRoot)
app.get('/products', api.listProducts)
app.post('/products', api.createProduct)
app.get('/products/:id', api.getProduct)
app.delete('/products/:id', api.deleteProduct)
app.put('/products/:id', api.updateProduct)
app.use(middleware.handleError)
app.use(middleware.notFound)
app.listen(port, () => console.log("Server listening on port ${port}"))