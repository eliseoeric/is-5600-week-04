const fs = require('fs').promises
const path = require('path')

const productsFile = path.join(__dirname, 'data/full-products.json')

async function list (options = {}) {
    const { offset = 0, limit = 25, tag} = options
    const data = await fs.readFile(productsFile)
  
    return JSON.parse(data)
    .filter(products => {
        if (!tag) {
           return products
        }
        return products.tags.find(( { title }) => title == tag)
      })
      .slice(offset, offset + limit) // Slice the products
  }

  async function get (id) {
    const products = JSON.parse( await fs.readFile(productsFile))
  
    // Loop through the products and return the product with the matching id
    for (let i = 0; i < products.length; i++) {
      if (products[i].id === id) {
        return products[i]
      }
    }
    return null;
}
async function deleteProduct(id) {
  const products = JSON.parse(await fs.readFile(productsFile));
  const productIndex = products.findIndex(product => product.id === id);

  if (productIndex === -1) return false; // Product not found

  products.splice(productIndex, 1); // Remove product from array
  await fs.writeFile(productsFile, JSON.stringify(products, null, 2));
  return true;
}
async function updateProduct(id, newProductData) {
  const products = JSON.parse(await fs.readFile(productsFile));
  const productIndex = products.findIndex(product => product.id === id);

  if (productIndex === -1) return null; // Product not found

  products[productIndex] = { ...products[productIndex], ...newProductData };
  await fs.writeFile(productsFile, JSON.stringify(products, null, 2));
  return products[productIndex];
}
module.exports = {  
    list,
    get,
    deleteProduct,
    updateProduct
  }