const express = require('express')
const path = require('path')
const bodyParser = require('body-parser')

const api = require('./api')
const middleware = require('./middleware')

const app = express()
const port = 3000

app.use(express.static(path.join(__dirname, 'public')))
app.use(middleware.cors)
app.use(bodyParser.json())

// ROOT
app.get('/', api.handleRoot)

// PRODUCTS
app.get('/products', api.listProducts)
app.get('/products/:id', api.getProduct)
app.post('/products', api.createProduct)
app.put('/products/:id', api.editProduct)
app.delete('/products/:id', api.deleteProduct)

// ORDERS
app.get('/orders', api.listOrders)
app.post('/orders', api.createOrder)
app.put('/orders/:id', api.editOrder)
app.delete('/orders/:id', api.deleteOrder)

// ERROR HANDLING
app.use(middleware.notFound)
app.use(middleware.handleError)

app.listen(port, () => {
  console.log(`Server running at http://localhost:${port}`)
})