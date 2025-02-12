const fs = require('fs').promises
const path = require('path')

const productsFile = path.join(__dirname, 'data/full-products.json')

module.exports = {
  list,
  get,
  remove,
  update
}


/**
 * List all products
 * @returns {Promise<Array>}
 */
async function list (options = {}) {
    const { offset = 0, limit = 25, tag } = options
    const data = await fs.readFile(productsFile)

    return JSON.parse(data)
    .filter(product=>{
        if(!tag){
            return product
        }
        return product.tags.find(( { title } ) => title == tag)
    })
    .slice(offset, offset + limit) // Slice the products
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

async function remove(id) {
    const data = await fs.readFile(productsFile);
    const products = JSON.parse(data);

    // Check if the product exists
    const productExists = products.filter((product) => product.id !== id);

    if (productExists.length === products.length) {
      // If the product doesn't exist, return null
      return null;
    }

    // Simulate deletion by not modifying the data
    // Return true to indicate the product "would have been" deleted
    return true;
  }
  async function update(id, productData) {
    // Simulate updating the product
    console.log(`Product with ID ${id} would be updated with data:`, productData);
    // Return true to indicate the update was "successful"
    return true;
  }