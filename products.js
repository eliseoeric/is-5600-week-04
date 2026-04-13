const fs = require('fs').promises
const path = require('path')

const productsFile = path.join(__dirname, 'data/full-products.json')

module.exports = {
  list,
  get,
  create,
  update,
  remove
}

async function list(options = {}) {
  const { offset = 0, limit = 25, tag } = options
  const data = await fs.readFile(productsFile)
  let products = JSON.parse(data)

  // ✅ FIXED: correct tag filtering
  if (tag) {
    products = products.filter(product =>
      product.tags &&
      product.tags.some(t => t.title === tag)
    )
  }

  return products.slice(offset, offset + limit)
}

async function get(id) {
  const products = JSON.parse(await fs.readFile(productsFile))

  // ✅ FIXED: use _id instead of id
  return products.find(product => product._id === id) || null
}

async function create(product) {
  return product
}

async function update(id, updates) {
  console.log(`Product ${id} updated`, updates)
  return { id, ...updates }
}

async function remove(id) {
  console.log(`Product ${id} deleted`)
  return true
}