const path = require('path')
const Products = require('./products')
const Orders = require('./orders')
const autoCatch = require('./lib/auto-catch')

function handleRoot(req, res) {
  res.sendFile(path.join(__dirname, 'index.html'))
}

// PRODUCTS
async function listProducts(req, res) {
  const { offset = 0, limit = 25, tag } = req.query

  const products = await Products.list({
    offset: Number(offset),
    limit: Number(limit),
    tag
  })

  res.json(products)
}

async function getProduct(req, res, next) {
  const product = await Products.get(req.params.id)

  if (!product) return next()

  res.json(product)
}

async function createProduct(req, res) {
  const product = await Products.create(req.body)
  res.json(product)
}

async function editProduct(req, res) {
  const product = await Products.edit(req.params.id, req.body)
  res.json(product)
}

async function deleteProduct(req, res) {
  const result = await Products.destroy(req.params.id)
  res.json(result)
}

// ORDERS
async function createOrder(req, res) {
  const order = await Orders.create(req.body)
  res.json(order)
}

async function listOrders(req, res) {
  const { offset = 0, limit = 25, productId, status } = req.query

  const orders = await Orders.list({
    offset: Number(offset),
    limit: Number(limit),
    productId,
    status
  })

  res.json(orders)
}

async function editOrder(req, res) {
  const order = await Orders.edit(req.params.id, req.body)
  res.json(order)
}

async function deleteOrder(req, res) {
  await Orders.destroy(req.params.id)
  res.json({ message: 'Order deleted' })
}

module.exports = autoCatch({
  handleRoot,

  // products
  listProducts,
  getProduct,
  createProduct,
  editProduct,
  deleteProduct,

  // orders
  createOrder,
  listOrders,
  editOrder,
  deleteOrder
})