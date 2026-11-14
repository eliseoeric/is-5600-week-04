
const express = require('express')
const path = require('path')
const api = require('./api')
const middleware = require('./middleware')

const app = express()
const PORT = process.env.PORT || 3000

// Middleware
app.use(express.json())
app.use(express.static(path.join(__dirname, 'public')))
app.use(middleware.cors)

// Routes
app.get('/', api.handleRoot)
app.get('/products', api.listProducts)
app.get('/products/:id', api.getProduct)
app.post('/products', api.createProduct)
app.put('/products/:id', api.updateProduct)
app.delete('/products/:id', api.deleteProduct)

// Error handling
app.use(middleware.notFound)
app.use(middleware.handleError)

// Start server
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`)
})
