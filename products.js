const fs = require('fs').promises
const path = require('path')

const productsFile = path.join(__dirname, 'data', 'full-products.json')

async function list({ offset = 0, limit = 25, tag } = {}) {
  const data = await fs.readFile(productsFile, 'utf8')
  const catalog = JSON.parse(data)

  const matches = tag
    ? catalog.filter(product => product.tags?.some(item => item.title === tag))
    : catalog

  return matches.slice(offset, offset + limit)
}

async function get(id) {
  const data = await fs.readFile(productsFile, 'utf8')
  const catalog = JSON.parse(data)
  return catalog.find(product => product.id === id)
}
function update(id, changes) {
  console.log('Product update requested:', id, changes)
}

function remove(id) {
  console.log('Product deletion requested:', id)
}
module.exports = { list, get, update, remove }