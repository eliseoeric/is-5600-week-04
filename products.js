const fs = require('fs').promises
const path = require('path')
const productsFile = path.resolve(__dirname, 'data', 'full-products.json')

module.exports = {
  list,
  get,
  create,
  update,
  remove
}

async function readAll () {
  const buf = await fs.readFile(productsFile, 'utf8')
  return JSON.parse(buf)
}

async function list (options = {}) {
  const { offset = 0, limit = 25, tag } = options
  let items = await readAll()
  if (tag) items = items.filter(p => Array.isArray(p.tags) && p.tags.includes(tag))
  return items.slice(offset, offset + limit)
}

async function get (id) {
  const items = await readAll()
  for (let i = 0; i < items.length; i++) {
    if (items[i].id === id) return items[i]
  }
  return null
}

async function create (data) {
  const id = data.id || generateId()
  const product = { id, ...data }
  console.log('Create product (stub):', product)
  return product
}

async function update (id, data) {
  console.log(`Update product (stub): ${id}`, data)
  return { id, ...data }
}

async function remove (id) {
  console.log(`Delete product (stub): ${id}`)
  return true
}

function generateId () {
  return Math.random().toString(36).slice(2, 10) + '_' + Date.now().toString(36)
}
