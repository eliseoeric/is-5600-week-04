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

  if (tag) {
    products = products.filter(product =>
      (product.tags && product.tags.some(t => t.title.toLowerCase() === tag.toLowerCase())) ||
      (product.photo_tags && product.photo_tags.some(t => t.title.toLowerCase() === tag.toLowerCase()))
    )
  }

  return products.slice(offset, offset + limit)
}

async function get(id) {
  const data = await fs.readFile(productsFile)
  const products = JSON.parse(data)

  return products.find(product => product.id === id) || null
}

async function create(productData) {
  console.log('Product created:', productData)
  return { id: Date.now().toString(), ...productData }
}

async function update(id, updateData) {
  console.log(`Product ${id} updated:`, updateData)
  return { id, ...updateData }
}

async function remove(id) {
  console.log(`Product ${id} deleted`)
  return { success: true }
}
