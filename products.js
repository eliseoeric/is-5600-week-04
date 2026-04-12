const fs = require('fs').promises
const path = require('path')

const productsFile = path.join(__dirname, 'data/full-products.json')

module.exports = {
  list,
  get,
  remove,
  update
}

// LIST PRODUCTS (WITH LIMIT, OFFSET, TAG)
async function list (options = {}) {
  const { offset = 0, limit = 25, tag } = options

  const data = await fs.readFile(productsFile)
  let products = JSON.parse(data)

  // FILTER BY TAG
  if (tag) {
  products = products.filter(p =>
    p.tags && p.tags.some(t => t.title === tag)
  )
}

  return products.slice(offset, offset + limit)
}

// GET SINGLE PRODUCT
async function get (id) {
  const products = JSON.parse(await fs.readFile(productsFile))

  return products.find(p => p.id === id) || null
}

// DELETE PRODUCT (FAKE)
async function remove (id) {
  console.log(`Product ${id} deleted`)
  return { message: "Deleted" }
}

// UPDATE PRODUCT (FAKE)
async function update (id, data) {
  console.log(`Product ${id} updated`, data)
  return { message: "Updated" }
}