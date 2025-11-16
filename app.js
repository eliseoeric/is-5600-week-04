const path = require('path')
const express = require('express')

const api = require('./api')
const middleware = require('./middleware')
const bodyParser = require('body-parser')

// Set the port
const port = process.env.PORT || 3000
// Boot the app
// register the routes
app.get('/products', listProducts)
app.get('/', handleRoot);
app.use(middleware.cors)
app.use(bodyParser.json())
app.get('/products', api.listProducts)
app.get('/',  api.handleRoot);
app.get('/products/:id', api.getProduct)
app.post('/products', api.createProduct)
app.use(middleware.handleError)
app.use(middleware.notfound)
// Boot the server
app.listen(port, () => console.log(`Server listening on port ${port}`))

 {
    res.status(500).json({ error: err.message })
  }
