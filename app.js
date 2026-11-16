
const express = require('express')
const path = require('path')

const api = require('./api')
const middleware = require('./middleware')

const port = process.env.PORT || 3000
const app = express()

// Register middleware
app.use(middleware.cors)
app.use(express.json())
app.use(express.static(path.join(__dirname, 'public')))

// Register API routes
app.get('/products', api.listProducts)
app.get('/products/:id', api.getProduct)
app.post('/products', api.createProduct)
app.put('/products/:id', api.updateProduct)
app.delete('/products/:id', api.deleteProduct)

// Homepage
app.get('/', api.handleRoot)

// Error handling middleware
app.use(middleware.notFound)
app.use(middleware.handleError)

// Start the server
app.listen(port, () => {
  console.log(`Server listening on port ${port}`)
})
