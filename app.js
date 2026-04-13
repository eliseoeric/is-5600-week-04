const express = require('express')
const bodyParser = require('body-parser')

const api = require('./api')
const middleware = require('./middleware')

const app = express()
const port = process.env.PORT || 3000

app.use(express.static('public'))
app.use(bodyParser.json())
app.use(middleware.cors)

app.get('/', api.handleRoot)
app.get('/products', api.listProducts)
app.get('/products/:id', api.getProduct)
app.post('/products', api.createProduct)
app.delete('/products/:id', api.deleteProduct)
app.put('/products/:id', api.updateProduct)

app.use(middleware.notFound)
app.use(middleware.handleError)

app.listen(port, () => console.log(`Server listening on port ${port}`))