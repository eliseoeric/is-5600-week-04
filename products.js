// products.js
const fs = require('fs').promises
const path = require('path')

const productsFile = path.join(__dirname, 'data/full-products.json')

module.exports = {
  list
}


/**
 * List all products
 * @returns {Promise<Array>}
 */
async function list (options = {}) {
  const { offset = 0, limit = 25 , tag } = options
  const data = await fs.readFile(productsFile)

  return JSON.parse(data)
    .filter(product => {
        if(!tag) {
          return product
        }
          return product.tags.find(( {title} ) => title == tag)
    })
    .slice(offset, offset + limit) // Slice the products
}
