const fs = require('fs').promises
const path = require('path')

const productsFile = path.join(__dirname, 'data', 'full-products.json')

module.exports = {
  list,
  get,
 create,
  update,
  remove
}

async function list(options = {}) {
  const { offset = 0, limit = 25, tag } = options

  const data = await fs.readFile(productsFile, 'utf8')
  let products = JSON.parse(data)

  if (tag) {
    products = products.filter(product => {
      return product.tags && product.tags.includes(tag)
    })
  }

  const total = products.length
  const items = products.slice(offset, offset + limit)

  return {
    total,
    items
  }
}

async function get(id) {
  const data = await fs.readFile(productsFile, 'utf8')
  const products = JSON.parse(data)

  for (let i = 0; i < products.length; i++) {
    if (products[i].id === id) {
      return products[i]
    }
  }

  return null
}

async function create(productData) {
  console.log('Created product:', productData)

  return {
    message: 'Product created successfully',
    product: productData
  }
}

async function update(id, productData) {
  console.log(`Updated product ${id}:`, productData)

  return {
    message: `Product ${id} updated successfully`,
    product: productData
  }
}

async function remove(id) {
  console.log(`Deleted product ${id}`)

  return {
    message: `Product ${id} deleted successfully`
  }
}