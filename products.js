
const fs = require('fs').promises
const path = require('path')
const crypto = require('crypto')

const productsFile = path.join(__dirname, 'data/full-products.json')

// List products with filtering and pagination
async function list(options = {}) {
  const { offset = 0, limit = 25, tag } = options

  const data = await fs.readFile(productsFile)
  let products = JSON.parse(data)

  if (tag) {
    products = products.filter(product =>
      Array.isArray(product.tags) &&
      product.tags.some(item =>
        item.title &&
        item.title.toLowerCase().includes(tag.toLowerCase())
      )
    )
  }

  return products.slice(offset, offset + limit)
}

// Get a single product by ID
async function get(id) {
  const data = await fs.readFile(productsFile)
  const products = JSON.parse(data)

  return products.find(product => product.id === id) || null
}

// Create a new product
async function create(productData) {
  const data = await fs.readFile(productsFile)
  const products = JSON.parse(data)

  const product = {
    ...productData,
    id: crypto.randomUUID(),
    created_at: new Date().toISOString()
  }

  products.push(product)

  await fs.writeFile(
    productsFile,
    JSON.stringify(products, null, 2)
  )

  return product
}

// Update an existing product
async function update(id, changes) {
  const data = await fs.readFile(productsFile)
  const products = JSON.parse(data)

  const index = products.findIndex(product => product.id === id)

  if (index === -1) {
    return null
  }

  products[index] = {
    ...products[index],
    ...changes,
    id,
    updated_at: new Date().toISOString()
  }

  await fs.writeFile(
    productsFile,
    JSON.stringify(products, null, 2)
  )

  return products[index]
}

// Delete a product
async function remove(id) {
  const data = await fs.readFile(productsFile)
  const products = JSON.parse(data)

  const index = products.findIndex(product => product.id === id)

  if (index === -1) {
    return false
  }

  products.splice(index, 1)

  await fs.writeFile(
    productsFile,
    JSON.stringify(products, null, 2)
  )

  return true
}

module.exports = {
  list,
  get,
  create,
  update,
  remove
}
