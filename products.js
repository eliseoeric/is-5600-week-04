const fs = require('fs').promises
const path = require('path')

const productsFile = path.join(__dirname, 'data/full-products.json')

module.exports = {
  list,
  get,
  create,
  update,
  delete: remove
}

async function readProducts () {
  const data = await fs.readFile(productsFile, 'utf8')
  return JSON.parse(data)
}

async function writeProducts (products) {
  await fs.writeFile(productsFile, JSON.stringify(products, null, 2), 'utf8')
}

async function list (options = {}) {
  const { offset = 0, limit = 25, tag } = options
  let products = await readProducts()

  if (tag) {
    products = products.filter(product => {
      if (Array.isArray(product.tags)) return product.tags.includes(tag)
      if (typeof product.tags === 'string') return product.tags === tag
      return false
    })
  }

  return products.slice(offset, offset + limit)
}

async function get (id) {
  const products = await readProducts()
  return products.find(product => product.id === id)
}

async function create (data) {
  const products = await readProducts()
  const product = {
    id: data.id || `${Date.now().toString(36)}-${Math.random().toString(36).slice(2, 8)}`,
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
    ...data
  }

  products.push(product)
  await writeProducts(products)
  return product
}

async function update (id, data) {
  const products = await readProducts()
  const index = products.findIndex(product => product.id === id)

  if (index === -1) return null

  const updated = {
    ...products[index],
    ...data,
    updated_at: new Date().toISOString()
  }

  products[index] = updated
  await writeProducts(products)
  return updated
}

async function remove (id) {
  const products = await readProducts()
  const remaining = products.filter(product => product.id !== id)

  if (remaining.length === products.length) return false

  await writeProducts(remaining)
  return true
}
