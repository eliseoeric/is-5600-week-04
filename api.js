const Products = require('./products')
const Orders = require('./orders')

/**
 * List products
 */
async function listProducts(req, res, next) {
  const { offset = 0, limit = 25, tag } = req.query

  const products = await Products.list({
    offset: Number(offset),
    limit: Number(limit),
    tag
  })

  res.json(products)
}

/**
 * Get one product
 */
async function getProduct(req, res, next) {
  const product = await Products.get(req.params.id)
  res.json(product)
}

/**
 * Create a new product
 */
async function createProduct(req, res, next) {
  const product = await Products.create(req.body)
  res.json(product)
}

/**
 * Update a product
 */
async function editProduct(req, res, next) {
  const change = req.body
  const product = await Products.edit(req.params.id, change)
  res.json(product)
}

/**
 * Delete a product
 */
async function deleteProduct(req, res, next) {
  const response = await Products.destroy(req.params.id)
  res.json(response)
}

/**
 * Create an order
 */
async function createOrder(req, res, next) {
  const order = await Orders.create(req.body)
  res.json(order)
}

/**
 * List orders
 */
async function listOrders(req, res, next) {
  const { offset = 0, limit = 25, productId, status } = req.query

  const orders = await Orders.list({
    offset: Number(offset),
    limit: Number(limit),
    productId,
    status
  })

  res.json(orders)
}

/**
 * Get one order
 */
async function getOrder(req, res, next) {
  const order = await Orders.get(req.params.id)
  res.json(order)
}

/**
 * Update an order
 */
async function editOrder(req, res, next) {
  const change = req.body
  const order = await Orders.edit(req.params.id, change)
  res.json(order)
}

/**
 * Delete an order
 */
async function deleteOrder(req, res, next) {
  const response = await Orders.destroy(req.params.id)
  res.json(response)
}

module.exports = {
  listProducts,
  getProduct,
  createProduct,
  editProduct,
  deleteProduct,
  listOrders,
  getOrder,
  createOrder,
  editOrder,
  deleteOrder
}