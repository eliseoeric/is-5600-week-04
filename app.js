const express = require('express')
const api = require('./api')
const middleware = require('./middleware')
const bodyParser = require('body-parser')

const port = process.env.PORT || 3000
const app = express()
// Register the public directory
app.use(express.static(__dirname + '/public'));
// Register the routes
app.use(middleware.cors)
app.use(bodyParser.json())
app.get('/products', api.listProducts)
app.get('/', api.handleRoot)
app.get('/products/:id', api.getProduct)
app.post('/products', api.createProduct)

app.use(middleware.handleError)
app.use(middleware.notFound)
app.put('/products/:id', api.updateProduct)
app.delete('/products/:id', api.deleteProduct)
// Boot the server
app.listen(port, () => console.log(`Server listening on port ${port}`))