const fs = require('fs').promises
const path = require('path')

const productsFile = path.join(__dirname, 'data/full-products.json')

async function list (options = {}) {

    const { offset = 0, limit = 25, tag } = options;

    const data = await fs.readFile(productsFile)

    return JSON.parse(data)
    .filter( product => {
        if (!tag) {
            return product
        }

        return product.tags.find(( { title }) => title == tag)
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
// New method to "update" a product
async function updateProduct(id, data) {
  console.log(`Product with ID ${id} was updated:`, data);
  return true; // Simulate success
}

// New method to "delete" a product
async function deleteProduct(id) {
  console.log(`Product with ID ${id} was deleted`);
  return true; // Simulate success
}

module.exports = {
  list,
  get,
  updateProduct,
  deleteProduct,
};
