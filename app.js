const express = require('express')
const path = require('path')
const bodyParser = require('body-parser')

const api = require('./api')
const middleware = require('./middleware')

const port = process.env.PORT || 3000
const app = express()

// ✅ Middleware FIRST
app.use(middleware.cors)
app.use(bodyParser.json())

// Static files
app.use(express.static(path.join(__dirname, 'public')))

// Routes (ONLY ONCE)
app.get('/', api.handleRoot)
app.get('/products', api.listProducts)
app.get('/products/:id', api.getProduct)

app.post('/products', api.createProduct)
app.delete('/products/:id', api.deleteProduct)
app.put('/products/:id', api.updateProduct)

// 404
app.use(middleware.notFound)

// Error handler
app.use(middleware.handleError)

// Start server
app.listen(port, () => {
  console.log(`Server running on port ${port}`)
})