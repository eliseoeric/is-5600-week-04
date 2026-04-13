const fs = require('fs').promises
const path = require('path')

const productsFile = path.join(__dirname, 'data/full-products.json')

module.exports = {
  list,
  get,
  create,
  update,
  remove
}

async function list (options = {}) {
  const { offset = 0, limit = 25, tag } = options
  const data = await fs.readFile(productsFile)
  let products = JSON.parse(data)

  if (tag) {
    products = products.filter(product =>
      Array.isArray(product.tags) &&
      product.tags.some(t => t.title === tag)
    )
  }

  return products.slice(offset, offset + limit)
}

async function get (id) {
  const products = JSON.parse(await fs.readFile(productsFile))

  for (let i = 0; i < products.length; i++) {
    if (products[i].id === id) {
      return products[i]
    }
  }

  return null
}

async function create (productData) {
  console.log('Created product:', productData)

  return {
    message: 'Product created successfully',
    product: productData
  }
}

async function update (id, productData) {
  const product = await get(id)

  if (!product) {
    return null
  }

  console.log(`Updated product ${id}:`, productData)

  return {
    message: `Product ${id} updated successfully`,
    product: {
      ...product,
      ...productData,
      id
    }
  }
}

async function remove (id) {
  const product = await get(id)

  if (!product) {
    return null
  }

  console.log(`Deleted product ${id}`)
  return true
}