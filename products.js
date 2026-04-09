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

async function readProducts () {
  const data = await fs.readFile(productsFile, 'utf8')
  return JSON.parse(data)
}

async function list (options = {}) {
  const { offset = 0, limit = 25, tag } = options
  let products = await readProducts()

  if (tag) {
    const tagLower = String(tag).toLowerCase()

    products = products.filter(product => {
      if (!Array.isArray(product.tags)) return false

      return product.tags.some(productTag => {
        if (typeof productTag === 'string') {
          return productTag.toLowerCase() === tagLower
        }

        if (productTag && typeof productTag.title === 'string') {
          return productTag.title.toLowerCase() === tagLower
        }

        return false
      })
    })
  }

  return products.slice(offset, offset + limit)
}

async function get (id) {
  const products = await readProducts()

  for (let i = 0; i < products.length; i++) {
    if (products[i].id === id) {
      return products[i]
    }
  }

  return null
}

async function create (productData = {}) {
  const newProduct = {
    id: productData.id || `product_${Date.now()}`,
    ...productData
  }

  console.log('Product created:', newProduct.id)
  return newProduct
}

async function update (id, updates = {}) {
  const existingProduct = await get(id)

  if (!existingProduct) {
    return null
  }

  const updatedProduct = {
    ...existingProduct,
    ...updates,
    id
  }

  console.log('Product updated:', id)
  return updatedProduct
}

async function remove (id) {
  const existingProduct = await get(id)

  if (!existingProduct) {
    return null
  }

  console.log('Product deleted:', id)

  return {
    message: `Product ${id} deleted`
  }
}