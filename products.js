const fs = require('fs').promises
const path = require('path')
const { randomUUID } = require('crypto')

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

async function writeProducts (products) {
  await fs.writeFile(productsFile, JSON.stringify(products, null, 2))
}

async function list (options = {}) {
  const { offset = 0, limit = 25, tag } = options
  let products = await readProducts()

  if (tag) {
    const normalized = String(tag).toLowerCase()
    products = products.filter(product => {
      if (!Array.isArray(product.tags)) return false
      return product.tags.some(tagItem => String(tagItem.title || '').toLowerCase().includes(normalized))
    })
  }

  const total = products.length
  const results = products.slice(offset, offset + limit)
  return { products: results, total }
}

async function get (id) {
  const products = await readProducts()
  return products.find(product => product.id === id)
}

async function create (productData) {
  const products = await readProducts()
  const product = {
    id: randomUUID(),
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
    ...productData
  }
  products.unshift(product)
  await writeProducts(products)
  return product
}

async function update (id, updateData) {
  const products = await readProducts()
  const index = products.findIndex(product => product.id === id)
  if (index === -1) return null

  const updatedProduct = {
    ...products[index],
    ...updateData,
    id,
    updated_at: new Date().toISOString()
  }

  products[index] = updatedProduct
  await writeProducts(products)
  return updatedProduct
}

async function remove (id) {
  const products = await readProducts()
  const index = products.findIndex(product => product.id === id)
  if (index === -1) return false

  products.splice(index, 1)
  await writeProducts(products)
  return true
}
