const fs = require('fs').promises
const path = require('path')
const { title } = require('process')

const productsFile = path.join(__dirname, 'data/full-products.json')


module.exports = {
  list,
  get,
  deleteProduct,
  updateProduct
}
/**
 * Update a product (placeholder)
 * @param {string} id
 * @param {object} data
 * @returns {Promise<void>}
 */
async function updateProduct(id, data) {
  console.log(`Product with id ${id} updated (placeholder). Data:`, data);
  // No actual update performed
}
/**
 * Delete a product (placeholder)
 * @param {string} id
 * @returns {Promise<void>}
 */
async function deleteProduct(id) {
  console.log(`Product with id ${id} deleted (placeholder)`);
  // No actual deletion performed
}


/**
 * List all products
 * @returns {Promise<Array>}
 */

async function list (options={}) {
  const { offset = 0, limit = 25,tag } = options
  const data = await fs.readFile(productsFile)

  return JSON.parse(data)
  .filter(product=>{
    if(!tag){
      return product
    }
    return product.tags.find(({title})=>title === tag)
  })
  .slice(offset, offset + limit) // Slice the products
}

// products.js

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