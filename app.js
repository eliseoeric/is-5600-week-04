const express = require('express')
const path = require('path')
const api = require('./api')

const app = express()

app.use(express.json())
app.use(express.static(path.join(__dirname, 'public')))

app.get('/', (req, res) => {
  res.send('Server is running')
})

app.get('/products', api.listProducts)
app.get('/products/:id', api.getProduct)
app.post('/products', api.createProduct)
app.put('/products/:id', api.editProduct)
app.delete('/products/:id', api.deleteProduct)

app.get('/orders', api.listOrders)
app.get('/orders/:id', api.getOrder)
app.post('/orders', api.createOrder)
app.put('/orders/:id', api.editOrder)
app.delete('/orders/:id', api.deleteOrder)

const port = process.env.PORT || 3000
app.listen(port, () => {
  console.log(`Server listening on port ${port}`)
})