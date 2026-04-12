const fs = require('fs').promises
const path = require('path')

const productsFile = path.join(__dirname, 'data', 'full-products.json')

module.exports = {
  list,
  get,
  create,
  update,
  remove
}

async function readProducts () {
  const data = await fs.readFile(productsFile, 'utf8')
  return JSON.parse(data)
}

async function list (options = {}) {
  const { offset = 0, limit = 25, tag } = options
  let products = await readProducts()

  if (tag) {
    const normalizedTag = String(tag).toLowerCase()
    products = products.filter(product =>
      (product.tags || []).some(tagItem =>
        String(tagItem.title || '').toLowerCase() === normalizedTag
      )
    )
  }

  return products.slice(offset, offset + limit)
}

async function get (id) {
  const products = await readProducts()
  return products.find(product => product.id === id) || null
}

async function create (product) {
  console.log('Creating product:', product)
  return {
    id: `new-${Date.now()}`,
    ...product
  }
}

async function update (id, updates) {
  console.log('Updating product:', id, updates)
  return {
    id,
    ...updates
  }
}

async function remove (id) {
  console.log('Deleting product:', id)
  return true
}
