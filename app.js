const express = require('express')
const api = require('./api')
const middleware = require('./middleware')
const bodyParser = require('body-parser')

const port = process.env.PORT || 3000
const app = express()

// Serve static files from /public
app.use(express.static(__dirname + '/public'))

// Global middleware
app.use(middleware.cors)
app.use(bodyParser.json())

// Routes
app.get('/', api.handleRoot)
app.get('/products', api.listProducts)
app.get('/products/:id', api.getProduct)

app.post('/products', api.createProduct)
app.put('/products/:id', api.updateProduct)
app.delete('/products/:id', api.deleteProduct)

// 404 + error handlers
app.use(middleware.notFound)
app.use(middleware.handleError)

app.listen(port, () => {
  console.log(`Server listening on port ${port}`)
})
