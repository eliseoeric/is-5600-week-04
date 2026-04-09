const express = require('express')
const api = require('./api')
const middleware = require('./middleware')
const bodyParser = require('body-parser')

// Set the port
const port = process.env.PORT || 3000

// Boot the app
const app = express()

// Middleware
app.use(middleware.cors)
app.use(bodyParser.json())

// Static files
app.use(express.static(__dirname + '/public'))

// Routes
app.get('/', api.handleRoot)
app.get('/products', api.listProducts)
app.get('/products/:id', api.getProduct)
app.post('/products', api.createProduct)
app.delete('/products/:id', api.deleteProduct)  
app.put('/products/:id', api.updateProduct)      

// 404 + error handling (if you added them)
app.use(middleware.notFound)
app.use(middleware.handleError)

// Boot server
app.listen(port, () => console.log(`Server listening on port ${port}`))

