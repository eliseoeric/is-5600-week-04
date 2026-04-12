const fs = require('fs').promises
const path = require('path')

const productsFile = path.join(__dirname, 'data/full-products.json')

module.exports = {
  list,
  get
}

async function list(options = {}) {
  const { offset = 0, limit = 25, tag } = options

  const data = JSON.parse(await fs.readFile(productsFile))

  let result = data

  // filter by tag
  if (tag) {
    result = result.filter(p =>
  p.tags && p.tags.some(t => t.title === tag)
)
  }

  return result.slice(offset, offset + limit)
}

async function get(id) {
  const products = JSON.parse(await fs.readFile(productsFile))

  return products.find(p => String(p.id) === String(id)) || null
}