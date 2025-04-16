const express = require('express') // <- You forgot this!
const api = require('./api')
const middleware = require('./middleware')
const bodyParser = require('body-parser')

// Set the port
const port = process.env.PORT || 3000

// Boot the app
const app = express()

// Register middleware
app.use(middleware.cors)
app.use(bodyParser.json())
app.use(express.static(__dirname + '/public'))

// Register routes
app.get('/', api.handleRoot)
app.get('/products', api.listProducts)
app.get('/products/:id', api.getProduct)
app.post('/products', api.createProduct)
app.put('/products/:id', api.updateProduct)
app.delete('/products/:id', api.deleteProduct)

// Error handling
app.use(middleware.notFound)
app.use(middleware.handleError)

// Start the server
app.listen(port, () => console.log(`Server listening on port ${port}`))
