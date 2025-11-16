const express = require('express')
const bodyParser = require('body-parser')
const api = require('./api')
const middleware = require('./middleware')

const app = express()

app.use(middleware.cors)
app.use(bodyParser.json())

app.get('/products', api.listProducts)
app.get('/products/:id', api.getProduct)
app.post('/products', api.createProduct)
app.put('/products/:id', api.updateProduct)
app.delete('/products/:id', api.deleteProduct)

app.get('/', api.handleRoot)

app.use(middleware.notFound)
app.use(middleware.handleError)

app.listen(3000, () => {
  console.log('Server running on port 3000')
})

module.exports = app