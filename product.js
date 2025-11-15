// products.js
const fs = require('fs').promises
const path = require('path')
const productsFile = path.join(__dirname, 'data/full-products.json')

module.exports = {
  list,
  get,
  create,
  update,
  del // use a different name for delete because `delete` is reserved
}

/**
 * List all products with optional tag filtering, offset, limit.
 * Returns { products: [...], total: number }
 */
async function list (options = {}) {
  const { offset = 0, limit = 25, tag } = options
  const data = JSON.parse(await fs.readFile(productsFile, 'utf8'))
  let items = data
  if (tag) {
    items = items.filter(p => Array.isArray(p.tags) ? p.tags.includes(tag) : (p.tag === tag || (p.tagsString && p.tagsString.includes(tag))))
  }
  const total = items.length
  const sliced = items.slice(Number(offset), Number(offset) + Number(limit))
  return { products: sliced, total }
}

/**
 * Get single product by id
 */
async function get (id) {
  const products = JSON.parse(await fs.readFile(productsFile, 'utf8'))
  for (let i = 0; i < products.length; i++) {
    if (products[i].id === id) return products[i]
  }
  return null
}

/**
 * Placeholder create — logs and returns created object
 */
async function create (product) {
  console.log('products.create called:', product)
  // Real code would persist; placeholder returns product
  return product
}

/**
 * Placeholder update — logs and returns updated object
 */
async function update (id, product) {
  console.log(`products.update ${id}`, product)
  return { id, ...product }
}

/**
 * Placeholder delete — logs and returns true
 */
async function del (id) {
  console.log(`products.delete ${id}`)
  return true
}
