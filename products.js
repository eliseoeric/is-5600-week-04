const fs = require('fs').promises
const path = require('path')

const productsFile = path.join(__dirname, 'data/full-products.json')

module.exports = {
  list,
  get,
  update,
  destroy
}

/**
 * List all products
 * @param {object} options
 * @returns {Promise<Array>}
 */
async function list(options = {}) {
  const { offset = 0, limit = 25, tag } = options
  const data = await fs.readFile(productsFile)
  let products = JSON.parse(data)

  // Filter products by tag if the tag parameter is provided
  if (tag) {
    products = products.filter(product => {
      // Assuming the products have a 'tags' array. If your dataset uses a string 'category', 
      // you could change this to product.category === tag
      return product.tags && product.tags.includes(tag)
    })
  }

  // Slice the array to handle offset and limits for pagination
  return products.slice(offset, offset + limit)
}

/**
 * Get a single product
 * @param {string} id
 * @returns {Promise<object>}
 */
async function get(id) {
  const data = await fs.readFile(productsFile)
  const products = JSON.parse(data)

  // Loop through the products and return the product with the matching id
  for (let i = 0; i < products.length; i++) {
    if (products[i].id === id) {
      return products[i]
    }
  }

  // If no product is found, return null
  return null
}

/**
 * Update a single product (Mock)
 * @param {string} id
 * @param {object} data
 */
async function update(id, data) {
  console.log(`Product with ID ${id} was updated.`)
}

/**
 * Delete a single product (Mock)
 * @param {string} id
 */
async function destroy(id) {
  console.log(`Product with ID ${id} was deleted.`)
}