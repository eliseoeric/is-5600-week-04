const express = require('express')
const api = require('./api')
const corsMiddleware = require('./middleware.js')

const port = process.env.PORT || 3000
const app = express()

app.use(corsMiddleware)
app.use(express.json()) // Middleware to parse JSON bodies

app.get('/', api.handleRoot)
app.get('/products', api.listProducts)
app.get('/products/:id', api.getProduct)
app.post('/products', api.createProduct)
app.put('/products/:id', api.updateProduct) 
app.delete('/products/:id', api.deleteProduct) 

app.listen(port, () => console.log(`Server listening on port ${port}`))