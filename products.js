const fs = require('fs').promises
const path = require('path')

const productsPath = path.join(__dirname, 'data', 'full-products.json')

async function list(options = {}) {
  const { offset = 0, limit = 25, tag } = options

  const file = await fs.readFile(productsPath, 'utf8')
  let products = JSON.parse(file)

  if (tag) {
    products = products.filter(product => {
      if (!Array.isArray(product.tags)) return false

      return product.tags.some(t => t.title === tag)
    })
  }

  return products.slice(offset, offset + limit)
}

async function get(id) {
  const file = await fs.readFile(productsPath, 'utf8')
  const products = JSON.parse(file)

  for (let i = 0; i < products.length; i++) {
    if (products[i].id === id) {
      return products[i]
    }
  }

  return null
}

async function create(data) {
  console.log('Created product:', data)
  return data
}

async function remove(id) {
  console.log(`Deleted product ${id}`)
  return { id }
}

async function update(id, data) {
  console.log(`Updated product ${id}`, data)
  return { id, ...data }
}

module.exports = {
  list,
  get,
  create,
  remove,
  update
}