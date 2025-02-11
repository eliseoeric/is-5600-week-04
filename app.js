const express = require('express')
const bodyParser = require('body-parser')
const path = require('path')
const api = require('./api')
const middleware = require('./middleware')

const app = express()
const port = 3000

// Middleware
app.use(middleware.cors)
app.use(bodyParser.json())
app.use(express.static('public'))

// Routes
app.get('/', api.handleRoot)
app.get('/products', api.listProducts)
app.get('/products/:id', api.getProduct)
app.post('/products', api.createProduct)
app.put('/products/:id', api.updateProduct)
app.delete('/products/:id', api.deleteProduct)

// Error handling middleware
app.use(middleware.handleError)
app.use(middleware.notFound)

app.listen(port, () => {
  console.log(`Server running at http://localhost:${port}`)
})