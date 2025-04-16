const fs = require('fs').promises
const path = require('path')

const productsFile = path.join(__dirname, 'data/full-products.json')

async function list(options = {}) {
  const { offset = 0, limit = 25, tag } = options
  const data = await fs.readFile(productsFile)
  let products = JSON.parse(data)

  if (tag) {
    products = products.filter(product =>
      product.tags && product.tags.some(({ title }) => title === tag)
    )
  }

  return products.slice(offset, offset + limit)
}

async function get(id) {
  const products = JSON.parse(await fs.readFile(productsFile))
  return products.find(p => p.id === id) || null
}

module.exports = {
  list,
  get
}
