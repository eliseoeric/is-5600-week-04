const express = require('express')
const path = require('path')
const bodyParser = require('body-parser')
const api = require('./api')
const middleware = require('./middleware')

const app = express()
const port = process.env.PORT || 3000

app.use(express.static(path.join(__dirname, 'public')))
app.use(bodyParser.json())
app.use(middleware.cors)

app.get('/', api.handleRoot)
app.get('/products', api.listProducts)
app.get('/products/:id', api.getProduct)
app.post('/products', api.createProduct)
app.put('/products/:id', api.updateProduct)
app.delete('/products/:id', api.deleteProduct)

app.use(middleware.notFound)
app.use(middleware.handleError)

app.listen(port, () => console.log(`Server running on port ${port}`))
