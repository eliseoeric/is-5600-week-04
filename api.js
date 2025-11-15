// api.js
const path = require('path')
const Products = require('./products')
const autoCatch = require('./lib/auto-catch') // or require('lib/auto-catch') depending on structure

function handleRoot (req, res) {
  res.sendFile(path.join(__dirname, 'index.html'))
}

async function listProducts (req, res) {
  const { offset = 0, limit = 25, tag } = req.query
  // Return object with products and total (see products.list implementation)
  res.json(await Products.list({
    offset: Number(offset),
    limit: Number(limit),
    tag
  }))
}

async function getProduct (req, res, next) {
  const { id } = req.params
  const product = await Products.get(id)
  if (!product) return next()
  return res.json(product)
}

async function createProduct (req, res) {
  // For now, simple placeholder: echo and log
  console.log('create product body:', req.body)
  // Ideally you would persist; placeholder returns created resource
  res.status(201).json(req.body)
}

async function updateProduct (req, res) {
  const { id } = req.params
  console.log(`update product ${id}:`, req.body)
  // placeholder — pretend updated and return updated body
  res.status(200).json({ id, ...req.body })
}

async function deleteProduct (req, res) {
  const { id } = req.params
  console.log(`deleted product ${id}`)
  // placeholder — return 202 Accepted
  res.status(202).json({ status: 'deleted', id })
}

module.exports = autoCatch({
  handleRoot,
  listProducts,
  getProduct,
  createProduct,
  updateProduct,
  deleteProduct
})
const express = require('express')
const bodyParser = require('body-parser')
const api = require('./api')
const middleware = require('./middleware') // correct path if in ./api/middleware

const app = express()

app.use(middleware.cors)
app.use(bodyParser.json())

app.get('/', api.handleRoot)
app.get('/products', api.listProducts)
app.get('/products/:id', api.getProduct)
app.post('/products', api.createProduct)
app.put('/products/:id', api.updateProduct)
app.delete('/products/:id', api.deleteProduct)

// catch 404
app.use(middleware.notFound)
// error handler
app.use(middleware.handleError)

app.listen(3000, () => console.log('listening on 3000'))
