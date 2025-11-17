// products.js
const fs = require('fs').promises
const path = require('path')

const productsFile = path.join(__dirname, 'data/full-products.json')

async function list({ offset = 0, limit = 25, tag } = {}) {
  const data = JSON.parse(await fs.readFile(productsFile))

  let results = data

  if (tag) {
    results = results.filter(p => {
      if (Array.isArray(p.tags)) return p.tags.includes(tag)
      return p.tag === tag
    })
  }

  return results.slice(offset, offset + limit)
}

async function get(id) {
  const data = JSON.parse(await fs.readFile(productsFile))
  return data.find(p => p.id === id) || null
}

async function create(product) {
  console.log("Pretending to create product:", product)
  return product
}

async function update(id, data) {
  console.log(`Pretending to update ${id}`, data)
  return { id, ...data }
}

async function remove(id) {
  console.log(`Pretending to delete ${id}`)
  return true
}

module.exports = {
  list,
  get,
  create,
  update,
  remove
}
