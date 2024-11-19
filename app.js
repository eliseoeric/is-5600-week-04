const express = require('express')
const api = require('./api')
const middleware = require('./middleware')
const bodyParser = require('body-parser')

const app = express()

// Register middleware
app.use(middleware.cors)
app.use(bodyParser.json())
app.use(express.static(__dirname + '/public'))

// Routes
app.get('/', api.handleRoot)
app.get('/products', api.listProducts)
app.get('/products/:id', api.getProduct)
app.post('/products', api.createProduct)
app.delete('/products/:id', api.deleteProduct)
app.put('/products/:id', api.updateProduct)

const port = process.env.PORT || 3000
app.listen(port, () => console.log(`Server listening on port ${port}`))