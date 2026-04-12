const fs = require('fs').promises
const path = require('path')
const productsFile = path.join(__dirname, 'data/full-products.json')

module.exports = { list, get }

async function list(options = {}) {
  const { offset = 0, limit = 25, tag } = options
  let products = JSON.parse(await fs.readFile(productsFile))

  // Filter by tag if provided
  if (tag) {
  products = products.filter(p => p.tags && p.tags.some(t => t.title === tag))
}

  return products.slice(offset, offset + limit)
}

async function get(id) {
  const products = JSON.parse(await fs.readFile(productsFile))
  for (let i = 0; i < products.length; i++) {
    if (products[i].id === id) return products[i]
  }
  return null
}