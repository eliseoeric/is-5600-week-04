const fs = require('fs').promises
const path = require('path')


const productsFile = path.join(__dirname, 'data/full-products.json')

async function list (options = {}) {

    const { offset = 0, limit = 25, tag } = options

    const data = await fs.readFile(productsFile)

    return JSON.parse(data)
    .filter(product => {
        if (!tag){
            return product 
        }
        
        return product.tags.find(({title}) => title == tag)
    })
    .slice(offset, offset + limit)
 }

 async function get (id) {
    const products = JSON.parse(await fs.readFile(productsFile))

    for (let i = 0; i < products.length; i++) {
        if (products[i].id === id) {
          return products[i]
        }
      }

      return null;
}

// Method to handle DELETE requests
function deleteProduct(productId) {
    console.log(`Product with ID ${productId} has been deleted.`);
    // Simulate product deletion (no real deletion logic needed for this lab)
}

// Method to handle PUT requests
function updateProduct(productId, updatedData) {
    console.log(`Product with ID ${productId} has been updated with data:`, updatedData);
    // Simulate product update (no real update logic needed for this lab)
}

 
module.exports = {
    list,
    get,
    deleteProduct,
    updateProduct,
};