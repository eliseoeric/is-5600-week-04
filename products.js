const fs = require('fs').promises
const path = require('path')

const productsFile = path.join(__dirname, 'data/full-products.json')

module.exports = {
  list,
  get,
  deleteProduct,
  updateProduct
}

/**
 * List all products
 * @param {object} options
 * @returns {Promise<Array>}
 */
async function list (options = {}) {
  const { offset = 0, limit = 25, tag } = options
  const data = await fs.readFile(productsFile)
  let products = JSON.parse(data)

  if (tag) {
    products = products.filter(product => {
      if (product.tags) {
        return product.tags.some(t => t.title === tag) || 
               (product.photo_tags && product.photo_tags.some(t => t.title === tag))
      }
      return false
    })
  }

  return products.slice(offset, offset + limit)
}

/**
 * Get a single product
 * @param {string} id
 * @returns {Promise<object>}
 */
async function get (id) {
  const products = JSON.parse(await fs.readFile(productsFile))

  // Loop through the products and return the product with the matching id
  for (let i = 0; i < products.length; i++) {
    if (products[i].id === id) {
      return products[i]
    }
  }

   // If no product is found, return null
  return null;
}

/**
 * Delete a product
 * @param {string} id
 */
async function deleteProduct (id) {
  console.log(`Product with id ${id} was deleted`)
}

/**
 * Update a product
 * @param {string} id
 * @param {object} data
 */
async function updateProduct (id, data) {
  console.log(`Product with id ${id} was updated`)
}
