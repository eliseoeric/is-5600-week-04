const fs = require('fs').promises
const path = require('path');
const { title } = require('process');

const productsFile = path.join(__dirname, 'data/full-products.json')

async function list (options = {}) {

    const { offset = 0, limit = 25, tag } = options;

    const data = await fs.readFile(productsFile)

    return JSON.parse(data)
    .filter(product =>{
        if (!tag) {
            return product
        }

        return product.tags.find(({ title } ) => title == tag)
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

/**
 * Delete a single product (simulation)
 * @param {string} id
 * @returns {Promise<boolean>}
 */
async function deleteProduct(id) {
    const products = JSON.parse(await fs.readFile(productsFile));  // Read products data from file
  
    const index = products.findIndex(product => product.id === id);  // Find the product by id
    if (index !== -1) {
      products.splice(index, 1);  // Remove the product from the array
      console.log(`Product with id ${id} deleted (simulation).`);  // Log the deletion
      return true;  // Simulate deletion
    }
  
    return false;  // Return false if product is not found
  }

  /**
 * Update a single product (simulation)
 * @param {string} id
 * @param {object} updatedProduct
 * @returns {Promise<boolean>}
 */
async function update(id, updatedProduct) {
    const products = JSON.parse(await fs.readFile(productsFile));  // Read products data from file
  
    const index = products.findIndex(product => product.id === id);  // Find the product by id
    if (index !== -1) {
      // Simulate updating the product by replacing it with the updated data
      products[index] = { ...products[index], ...updatedProduct };
      console.log(`Product with id ${id} updated (simulation).`);  // Log the update
      return true;  // Simulate successful update
    }
  
    return false;  // Return false if product is not found
  }


module.exports = {
    list,
    get,
    update,
    deleteProduct
};
    