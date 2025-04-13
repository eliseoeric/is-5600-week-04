const fs = require('fs').promises
const path = require('path')


const productsFile = path.join(__dirname, 'data/full-products.json')

async function list (options = {}) {
    const { offset = 0, limit = 25, tag } = options;
    const data = await fs.readFile(productsFile)
  
    return JSON.parse(data)
    .filter(product => {
        if (!tag){
            return product
        }

        return product.tags.find(({title}) => title == tag)

    } )
    
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
// Add deleteProduct method
  async function deleteProduct(req, res) {
    const productId = req.params.id;
    console.log(`Product with ID ${productId} deleted.`);  // Log the deletion

    res.status(202).json({ message: `Product ${productId} has been deleted (mocked).` });
}

// Add updateProduct method
async function updateProduct(req, res) {
    const productId = req.params.id;
    console.log(`Product with ID ${productId} updated.`);  // Log the update action

    res.status(200).json({ message: `Product ${productId} has been updated (mocked).` });
}
module.exports = {
    list,
    get,
    deleteProduct,
    updateProduct
}