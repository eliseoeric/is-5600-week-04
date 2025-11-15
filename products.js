const fs = require('fs').promises
const path = require('path')

const productsFile = path.join(__dirname, 'data/full-products.json')

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

async function create(productData) {
  console.log("Creating product (placeholder)", productData)
  return true
}

async function update(id, data) {
  console.log(`Updating product ${id}`, data)
  return true
}

async function remove(id) {
  console.log(`Deleting product ${id}`)
  return true
}


module.exports = {
  list,
  get,
  create,
  update,
  remove

}



