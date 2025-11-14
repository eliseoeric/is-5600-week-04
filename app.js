const express = require('express')
const api = require('./api')
const middleware = require('./middleware')

// Set the port
const port = process.env.PORT || 3000

// Boot the app
const app = express()

// Global middleware
app.use(middleware.cors)              // CORS headers
app.use(express.json())               // Parse JSON bodies
app.use(express.static(__dirname + '/public')) // Frontend files

// Routes
app.get('/', api.handleRoot)

// Products collection routes
app.get('/products', api.listProducts)
app.post('/products', api.createProduct)

// Single product routes
app.get('/products/:id', api.getProduct)
app.put('/products/:id', api.updateProduct)
app.delete('/products/:id', api.deleteProduct)

// 404 + error handlers (must come AFTER routes)
app.use(middleware.notFound)
app.use(middleware.handleError)

// Boot the server
app.listen(port, () => console.log(`Server listening on port ${port}`))
