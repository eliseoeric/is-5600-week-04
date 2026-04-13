// app.js
const path = require('path')
const express = require('express')
const api = require('./api')
const middleware = require('./middleware')

// Set the port
const port = process.env.PORT || 3000

// Boot the app
const app = express()

// Register the public directory
app.use(express.static(path.join(__dirname, 'public')))

// Register middleware
app.use(middleware.cors)
app.use(express.json())
app.options('*', (req, res) => res.sendStatus(204))

// Register the routes
app.get('/', api.handleRoot)
app.get('/products', api.listProducts)
app.get('/products/:id', api.getProduct)
app.post('/products', api.createProduct)
app.put('/products/:id', api.updateProduct)
app.delete('/products/:id', api.deleteProduct)

// Handle errors and 404s
app.use(middleware.notFound)
app.use(middleware.handleError)

app.listen(port, () => console.log(`Server running on port ${port}`))