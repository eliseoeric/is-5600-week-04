const fs = require('fs').promises
const path = require('path')
const { del } = require('express/lib/application')

const productsFile = path.join(__dirname, 'data/full-products.json')

module.exports = {
  list,
  get,
  create,
  delete: deleteProduct,
  update
}

async function list(options = {}) {
  const { offset = 0, limit = 25, tag } = options
  let data = JSON.parse(await fs.readFile(productsFile))

  if (tag) {
    data = data.filter(product => product.tags && product.tags.includes(tag))
  }

  return {
    total: data.length,
    products: data.slice(offset, offset + limit)
  }
}

async function get(id) {
  const products = JSON.parse(await fs.readFile(productsFile))
  return products.find(product => product.id === id) || null
}

async function create(product) {
  console.log('Creating product:', product)
}

async function deleteProduct(id) {
  console.log(`Deleting product with ID: ${id}`)
}

async function update(id, updatedProduct) {
  console.log(`Updating product with ID: ${id} - New Data:`, updatedProduct)
}
