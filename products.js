const fs = require('fs').promises
const path = require('path')

const productsFile = path.join(__dirname, 'data/full-products.json')

/**
 * List products with pagination + optional tag filter
 */
async function list (options = {}) {
  const { offset = 0, limit = 25, tag } = options
  const data = await fs.readFile(productsFile)

  return JSON.parse(data)
    .filter(product => {
      if (!tag) {
        return true
      }

      return product.tags.find(_tag => _tag.title === tag)
    })
    .slice(offset, offset + limit)
}

/**
 * Get a single product by id
 */
async function get (id) {
  const products = JSON.parse(await fs.readFile(productsFile))

  for (let i = 0; i < products.length; i++) {
    if (products[i].id === id) {
      return products[i]
    }
  }

  // If no product is found, return null
  return null
}

module.exports = {
  list,
  get
}
