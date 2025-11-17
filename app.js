const express = require('express')
const bodyParser = require('body-parser')
const api = require('./api')
const middleware = require('./middleware')

const port = process.env.PORT || 5000
const app = express()

app.use(middleware.cors)
app.use(bodyParser.json())
app.use(express.static(__dirname + '/public'))

app.get('/', api.handleRoot)
app.get('/products', api.listProducts)
app.get('/products/:id', api.getProduct)
app.post('/products', api.createProduct)
app.put('/products/:id', api.updateProduct)
app.delete('/products/:id', api.deleteProduct)

app.use(middleware.notFound)
app.use(middleware.handleError)

app.listen(port, '0.0.0.0', () => console.log(`Server listening on port ${port}`))
