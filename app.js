const path = require('path')
const express = require('express')
const api = require('./api')

const port = process.env.PORT || 3000
const app = express()

app.use(express.json())
app.use(requestLogger)
app.use(express.static(path.join(__dirname, 'public')))

app.get('/', api.handleRoot)
app.get('/products', api.listProducts)
app.get('/products/:id', api.getProduct)
app.post('/products', api.createProduct)
app.put('/products/:id', api.updateProduct)
app.delete('/products/:id', api.deleteProduct)

app.use(errorHandler)

app.listen(port, () => console.log(`Server listening on port ${port}`))

function requestLogger (req, res, next) {
  console.log(`${req.method} ${req.url}`)
  next()
}

function errorHandler (err, req, res, next) {
  console.error(err)
  res.status(500).json({ error: err.message || 'Server error' })
}
