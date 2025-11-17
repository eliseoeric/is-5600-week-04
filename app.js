const express = require('express')
const api = require('./api')
const middleware = require('./middleware')
const bodyParser = require('body-parser')

// Set the port
const port = process.env.PORT || 3000

// Boot the app
const app = express()

// Register the public directory using __dirname + '/public'
app.use(express.static(__dirname + '/public'))

// Register middlewares
app.use(middleware.cors)
app.use(bodyParser.json())

// Register the routes
app.get('/products', api.listProducts)
app.get('/', api.handleRoot)
app.get('/products/:id', api.getProduct)
app.post('/products', api.createProduct)
app.delete('/products', api.deleteProduct)
app.put('/products', api.updateProduct)

// Register error handling middleware
app.use(middleware.handleError)
app.use(middleware.notFound)

// Boot the server
app.listen(port, () => console.log(`Server listening on port ${port}`))