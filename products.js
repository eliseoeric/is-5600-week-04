// products.js
const fs = require('fs').promises
const path = require('path')

const productsFile = path.join(__dirname, 'data/full-products.json')

// LIST (pagination + tag filter)
async function list(options = {}) {
  const { offset = 0, limit = 25, tag } = options

  const data = JSON.parse(await fs.readFile(productsFile))

  let filtered = data

  // correct tag filtering
  if (tag) {
    filtered = data.filter(p =>
      (p.tags || []).some(t => t.title === tag)
    )
  }

  return filtered.slice(offset, offset + limit)
}

// GET single product
async function get(id) {
  const products = JSON.parse(await fs.readFile(productsFile))
  return products.find(p => p.id === id) || null
}

// DELETE 
async function remove(id) {
  console.log(`Deleted product ${id}`)
}

// UPDATE 
async function update(id, data) {
  console.log(`Updated product ${id}`, data)
}

module.exports = {
  list,
  get,
  remove,
  update
}