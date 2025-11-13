const express = require('express')
const bodyParser = require('body-parser')
const api = require('./api')

const app = express()
const PORT = 3000

// let Express read JSON in request bodies
app.use(bodyParser.json())

// Home page
app.get('/', api.handleRoot)

// Products routes
app.get('/products', api.listProducts)
app.get('/products/:id', api.getProduct)
app.post('/products', api.createProduct)
app.put('/products/:id', api.updateProduct)
app.delete('/products/:id', api.deleteProduct)

// Start server
app.listen(PORT, () => {
  console.log(`Server listening on port ${PORT}`)
})
