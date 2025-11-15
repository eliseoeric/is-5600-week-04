// products.js
const fs = require('fs').promises
const path = require('path')

const productsFile = path.join(__dirname, 'data/full-products.json')

// List with pagination + filtering
async function list(options = {}) {
  const { offset = 0, limit = 25, tag } = options
  const data = JSON.parse(await fs.readFile(productsFile))

  let result = data

  // Filter by tag
  if (tag) {
    result = result.filter(prod =>
      prod.tags && prod.tags.includes(tag)
    )
  }

  return result.slice(offset, offset + limit)
}

// Get single product
async function get(id) {
  const data = JSON.parse(await fs.readFile(productsFile))
  return data.find(p => p.id === id) || null
}

// Delete product (mock)
async function deleteProduct(id) {
  console.log("(Mock) Product deleted:", id)
  return true
}

// Update product (mock)
async function updateProduct(id, data) {
  console.log("(Mock) Product updated:", id)
  console.log("New data:", data)
  return true
}

module.exports = {
  list,
  get,
  delete: deleteProduct,
  update: updateProduct
}
