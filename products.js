
const fs = require('fs').promises
const path = require('path')

const productsFile = path.join(__dirname, 'data/full-products.json')

module.exports = {
  list,
  get,
  delete: deleteProduct,
  update
}

// List products with pagination and tag filtering
async function list(options = {}) {
  const { offset = 0, limit = 25, tag } = options

  const data = await fs.readFile(productsFile)
  let products = JSON.parse(data)

  if (tag) {
    products = products.filter(product =>
      product.tags.some(item => item.title === tag)
    )
  }

  return products.slice(offset, offset + limit)
}

// Get a single product by ID
async function get(id) {
  const data = await fs.readFile(productsFile)
  const products = JSON.parse(data)

  for (let i = 0; i < products.length; i++) {
    if (String(products[i].id) === String(id)) {
      return products[i]
    }
  }

  return null
}

// Delete a product (demo only)
async function deleteProduct(id) {
  console.log('Deleting product:', id)
}

// Update a product (demo only)
async function update(id, product) {
  console.log('Updating product:', id, product)
}
