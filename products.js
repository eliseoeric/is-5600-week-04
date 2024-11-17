const fs = require('fs').promises
const path = require('path')

const productsFile = path.join(__dirname, 'data/full-products.json')

/**
 * List all products
 * @returns {Promise<Array>}
 */
async function list (options = {}) {
    
    const { offset = 0, limit = 25, tag } = options;
    
    const data = await fs.readFile(productsFile)
    
    return JSON.parse(data)
    .filter(product => {
        if (!tag) {
            return product
        }

        return product.tags.find(( { title }) => title == tag)
    })
    .slice(offset, offset + limit)
}
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
async function update(id, updates) {
    // Log the update attempt
    console.log(`Attempting to update product ${id} with:`, updates)
    
    // Get the product to update
    const product = await get(id)
    
    if (!product) {
      return null
    }
    
    // In a real implementation, we would save the updates here
    console.log(`Product ${id} was successfully updated`)
    
    // Return the "updated" product
    return { ...product, ...updates }
}

async function remove(id) {
    // Log the delete attempt
    console.log(`Attempting to delete product ${id}`)
    
    // Get the product to delete
    const product = await get(id)
    
    if (!product) {
      return null
    }
    
    // In a real implementation, we would delete the product here
    console.log(`Product ${id} was successfully deleted`)
    
    return true
}
  
module.exports = {
    list,
    get,
    remove,
    update,
  }