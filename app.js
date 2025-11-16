// app.js
const path = require('path')
const express = require('express')
const bodyParser = require('body-parser')

const api = require('./api')
const middleware = require('./middleware')

const app = express()
const PORT = process.env.PORT || 3000

// Serve static files (frontend)
app.use(express.static(path.join(__dirname, 'public')))

// Parse JSON for POST/PUT
app.use(bodyParser.json())

// CORS middleware
app.use(middleware.cors)

// Routes
app.get('/', api.handleRoot)
app.get('/products', api.listProducts)
app.get('/products/:id', api.getProduct)
app.post('/products', api.createProduct)
app.put('/products/:id', api.updateProduct)
app.delete('/products/:id', api.deleteProduct)

// 404 handler
app.use(middleware.notFound)

// Error handler
app.use(middleware.handleError)

app.listen(PORT, () => {
  console.log(`Server listening on port ${PORT}`)
})
