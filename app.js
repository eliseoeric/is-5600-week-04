const path = require('path')
const express = require('express')
const { handleRoot, listProducts, getProduct, createProduct, updateProduct, deleteProduct } = require('./api')
const middleware = require('./middleware')

// Set the port
const port = process.env.PORT || 3000
// Boot the app
const app = express()

// Parse JSON bodies
app.use(express.json())
// Serve static files
app.use(express.static(path.join(__dirname, 'public')))
// CORS middleware
app.use(middleware.cors)

// register the routes
app.get('/products', listProducts)
app.get('/products/:id', getProduct)
app.get('/', handleRoot)
app.post('/products', createProduct)
app.put('/products/:id', updateProduct)
app.delete('/products/:id', deleteProduct)

// 404 + error handlers (must be after routes)
app.use(middleware.notFound)
app.use(middleware.handleError)

// Boot the server
app.listen(port, () => console.log(`Server listening on port ${port}`))