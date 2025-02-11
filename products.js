
const fs = require('fs').promises
const path = require('path')

const productsFile = path.join(__dirname, 'data/full-products.json')

async function list (options = {}) {

  const { offset = 0, limit = 25, tag } = options
  const data = await fs.readFile(productsFile)
  return JSON.parse(data)
  .filter(product => {
    if (!tag) {
      return product
    }
    return product.tags.find(({title}) => title == tag )
  }).slice(offset, offset + limit)
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
// Placeholder create function to avoid errors
async function create(product) {
  console.log(`Product created:`, product);
  return product;
}

// DELETE function (logs deletion but does not persist changes)
async function deleteProduct(req, res) {
  const { id } = req.params;
  console.log(`Product with ID ${id} deleted.`);
  res.status(202).json({ message: `Product with ID ${id} deleted.` });
}

// PUT function (logs update but does not persist changes)
async function updateProduct(req, res) {
  const { id } = req.params;
  console.log(`Product with ID ${id} updated.`, req.body);
  res.status(200).json({ message: `Product with ID ${id} updated.`, updatedData: req.body });
}
module.exports = {
  list, get, create, deleteProduct, updateProduct
}