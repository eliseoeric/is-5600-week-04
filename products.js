const fs = require('fs').promises
const path = require('path')

const productsFile = path.join(__dirname, 'data', 'full-products.json')

async function list({ offset = 0, limit = 25, tag } = {}) {
  const data = await fs.readFile(productsFile, 'utf8')
  const allProducts = JSON.parse(data)
  const searchTag = typeof tag === 'string' ? tag.trim().toLowerCase() : ''

  const matchingProducts = searchTag
    ? allProducts.filter(product =>
        product.tags?.some(item => item.title?.toLowerCase() === searchTag)
      )
    : allProducts

  return matchingProducts.slice(offset, offset + limit)
}
async function get(id) {
  const data = await fs.readFile(productsFile, 'utf8')
  const allProducts = JSON.parse(data)
  return allProducts.find(product => product.id === id)
}

function deleteProduct(id) {
  console.log(`Delete requested for product ${id}`)
}

function updateProduct(id, changes) {
  console.log(`Update requested for product ${id}`, changes)
}

module.exports = { list, get, deleteProduct, updateProduct }