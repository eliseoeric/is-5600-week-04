const express = require('express')
const path = require('path')
const bodyParser = require('body-parser')
const api = require('./api')
const middleware = require('./middleware')

const app = express()
app.use(express.static(path.join(__dirname, 'public')))
app.use(middleware.cors)
app.use(bodyParser.json())
app.get('/', api.handleRoot)
app.get('/products', api.listProducts)
app.get('/products/:id', api.getProduct)
app.post('/products', api.createProduct)
app.put('/products/:id', api.updateProduct)
app.delete('/products/:id', api.deleteProduct)
app.use(middleware.notFound)
app.use(middleware.handleError)

function start(port) {
  const server = app.listen(port, () => {
    console.log(`Server listening on http://localhost:${port}`)
  })
  server.on('error', (err) => {
    if (err.code === 'EADDRINUSE') {
      const next = port + 1
      console.log(`Port ${port} in use, trying ${next}...`)
      start(next)
    } else {
      throw err
    }
  })
}
start(Number(process.env.PORT) || 3000)
