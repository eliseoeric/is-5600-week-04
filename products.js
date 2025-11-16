
const fs = require('fs').promises
const path = require('path')

const productsFile = path.join(__dirname, 'data/full-products.json')

// List products with optional offset, limit, tag
async function list (options = {}) {
  const { offset = 0, limit = 25, tag } = options

  const data = await fs.readFile(productsFile)
  let products = JSON.parse(data)

  if (tag) {
    products = products.filter(p =>
      Array.isArray(p.tags) &&
      p.tags.some(t => t.title && t.title.toLowerCase() === tag.toLowerCase())
    )
  }

  // just slice for pagination
  const sliced = products.slice(offset, offset + limit)

  // lab only needs an array; frontend expects array of prints
  return sliced
}

// Get a single product by id
async function get (id) {
  const products = JSON.parse(await fs.readFile(productsFile))
  for (let i = 0; i < products.length; i++) {
    if (products[i].id === id) {
      return products[i]
    }
  }
  return null
}

// Create product – for this lab we only log and echo
async function create (data) {
  console.log('Create product (fake):', data)
  return data
}

// Update product – just log and echo per lab instructions
async function update (id, data) {
  console.log(`Update product (fake) id=${id}:`, data)
  return { id, ...data }
}

// Delete product – just log per lab instructions
async function remove (id) {
  console.log(`Delete product (fake) id=${id}`)
  return
}

module.exports = {
  list,
  get,
  create,
  update,
  remove
}
