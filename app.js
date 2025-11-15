// app.js
const express = require('express')
const path = require('path')
const bodyParser = require('body-parser')

// local modules - adjust paths if yours are different
const middleware = require('./middleware')
const api = require('./api')

const app = express()           // <-- create the app BEFORE using it
const PORT = process.env.PORT || 3000

// middleware
app.use(middleware.cors)
app.use(bodyParser.json())

// static files (public folder)
app.use(express.static(path.join(__dirname, 'public')))

// routes
app.get('/', api.handleRoot)
app.get('/products', api.listProducts)
app.get('/products/:id', api.getProduct)
app.post('/products', api.createProduct)
app.put('/products/:id', api.updateProduct)
app.delete('/products/:id', api.deleteProduct)

// 404 + error handlers from middleware (if you added them)
if (middleware.notFound) app.use(middleware.notFound)
if (middleware.handleError) app.use(middleware.handleError)

// start server
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`)
})
