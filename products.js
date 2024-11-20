const fs = require('fs').promises;
const path = require('path');

const productsFile = path.join(__dirname, 'data/full-products.json');

async function list (options = {}) {
    const { offset = 0, limit = 25 } = options
    const data = await fs.readFile(productsFile)
  
    return JSON.parse(data).slice(offset, offset + limit) // Slice the products
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

async function create(productData) {
  console.log(`A product with product data: ${productData} is created`);
  return productData;
}

async function update(id, updatedData) {
  console.log(`the product with id: ${id} is been updated with new data ${updatedData}`);
}

async function remove(id) {
  console.log(`The product with id: ${id} is been deleted`);
}

module.exports = {
    list,
    get,
    create,
    update,
    remove,
  };