const fs = require('fs').promises
const path = require('path')

const productsFile = path.join(__dirname, 'data/full-products.json')

module.exports = {
  list,
  get
}

/**
 * List all products with optional pagination and tag filtering
 */
async function list(options = {}) {
  const { offset = 0, limit = 25, tag } = options

  const data = await fs.readFile(productsFile, 'utf8')
  let products = JSON.parse(data)

  // Filter by tag if provided
  if (tag) {
    products = products.filter((product) => {
      if (!product.tags || !Array.isArray(product.tags)) {
        return false
      }

      return product.tags.includes(tag)
    })
  }

  const total = products.length
  const items = products.slice(offset, offset + limit)

  return {
    total,
    items
  }
}

/**
 * Get one product by id
 */
async function get(id) {
  const data = await fs.readFile(productsFile, 'utf8')
  const products = JSON.parse(data)

  for (let i = 0; i < products.length; i++) {
    if (products[i].id === id) {
      return products[i]
    }
  }

  return null
}