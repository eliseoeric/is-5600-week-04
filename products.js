const fs = require('fs').promises
const path = require('path')

const productsFile = path.join(__dirname, 'data/full-products.json')

// List products with limit/offset and optional tag
async function list(options = {}) {
  const { offset = 0, limit = 25, tag } = options

  const data = await fs.readFile(productsFile)
  let products = JSON.parse(data)

  if (tag) {
    products = products.filter(p => Array.isArray(p.tags) && p.tags.includes(tag))
  }

  return products.slice(offset, offset + limit)
}

// Get a single product by id
async function get(id) {
  const data = await fs.readFile(productsFile)
  const products = JSON.parse(data)

  return products.find(p => p.id === id) || null
}

module.exports = {
  list,
  get
}
