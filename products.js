const fs = require('fs').promises
const path = require('path')

const productsFile = path.join(__dirname, 'data/full-products.json')

module.exports = {
  list,
  get
}

//products
async function list(options = {}) {
  const { offset = 0, limit = 25, tag } = options
  const data = await fs.readFile(productsFile)
  let products = JSON.parse(data)

  if (tag) {
    products = products.filter(product => {
      return Array.isArray(product.tags) && product.tags.some(t => t.title === tag)
    })
  }

  return products.slice(offset, offset + limit)
}

async function get(id) {
  const data = await fs.readFile(productsFile)
  const products = JSON.parse(data)

  for (let i = 0; i < products.length; i++) {
    if (products[i].id === id) {
      return products[i]
    }
  }

  return null
}