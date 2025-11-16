const express = require('express')
const path = require('path')
const bodyParser = require('body-parser')

const api = require('./api')
const middleware = require('./middleware')

const app = express()
const port = process.env.PORT || 3000

// Static files (frontend)
app.use(express.static(path.join(__dirname, 'public')))

// CORS + JSON body parsing
app.use(middleware.cors)
app.use(bodyParser.json())

// Routes
app.get('/', api.handleRoot)
app.get('/products', api.listProducts)
app.get('/products/:id', api.getProduct)

// ====== YOUR LAB TASKS (mock implementations) ======

// Create product (POST /products)
app.post('/products', (req, res) => {
  console.log('Creating product:', req.body)
  res.status(201).json({ message: 'Product created (mock)', data: req.body })
})

// Update product (PUT /products/:id)
app.put('/products/:id', (req, res) => {
  console.log('Updating product:', req.params.id, req.body)
  res.status(200).json({ message: 'Product updated (mock)', id: req.params.id })
})

// Delete product (DELETE /products/:id)
app.delete('/products/:id', (req, res) => {
  console.log('Deleting product:', req.params.id)
  res.status(202).json({ message: 'Product deleted (mock)', id: req.params.id })
})

// 404 + error handlers
app.use(middleware.notFound)
app.use(middleware.handleError)

app.listen(port, () => {
  console.log(`Server listening on port ${port}`)
})
