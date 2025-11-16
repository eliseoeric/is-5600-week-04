// products.js
const fs = require('fs').promises
const path = require('path')

const productsFile = path.join(__dirname, 'data/full-products.json')

module.exports = {
  list,
  get,
  update,
  remove
}

async function list(options = {}) {
  const { offset = 0, limit = 25, tag } = options
  const data = JSON.parse(await fs.readFile(productsFile))

  let result = data

  if (tag) {
    result = result.filter(p =>
      p.tags.some(t => t.title.toLowerCase() === tag.toLowerCase())
    )
  }

  return result.slice(offset, offset + limit)
}

async function get(id) {
  const products = JSON.parse(await fs.readFile(productsFile))
  return products.find(p => p.id === id) || null
}

async function update(id, info) {
  console.log(`Fake update: product ${id}`, info)
  return true
}

async function remove(id) {
  console.log(`Fake delete: product ${id}`)
  return true
}
