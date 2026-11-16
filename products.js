const fs = require('fs').promises
const path = require('path')

const productsFile = path.join(
  __dirname,
  'data/full-products.json'
)

// List products with filtering and pagination
async function list(options = {}) {
  const { offset = 0, limit = 25, tag } = options

  const data = await fs.readFile(productsFile)
  let products = JSON.parse(data)

  // Filter by tag
  if (tag) {
    products = products.filter(product =>
      product.tags.some(item =>
        item.title.toLowerCase() === tag.toLowerCase()
      )
    )
  }

  // Apply pagination
  return products.slice(offset, offset + limit)
}

// Get a single product by ID
async function get(id) {
  const data = await fs.readFile(productsFile)
  const products = JSON.parse(data)

  const product = products.find(
    product => product.id === id
  )

  return product || null
}


async function update(id, data) {
  console.log('Product updated:', id, data)

  return {
    message: 'Product updated',
    id
  }
}


async function remove(id) {
  console.log('Product deleted:', id)

  return {
    message: 'Product deleted',
    id
  }
}

module.exports = {
  list,
  get,
  update,
    remove
}