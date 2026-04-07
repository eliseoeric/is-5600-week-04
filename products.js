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

async function loadProducts () {
  const data = await fs.readFile(productsFile, 'utf8')
  return JSON.parse(data)
}

async function saveProducts (products) {
  await fs.writeFile(productsFile, JSON.stringify(products, null, 2))
}

async function list (options = {}) {
  const { offset = 0, limit = 25, tag } = options
  let products = await loadProducts()

  if (tag) {
    const normalizedTag = String(tag).toLowerCase()
    products = products.filter(product => {
      const tags = Array.isArray(product.tags) ? product.tags : []
      return tags.some(item => String(item?.title || item).toLowerCase().includes(normalizedTag))
    })
  }

  return products.slice(Number(offset), Number(offset) + Number(limit))
}

async function get (id) {
  const products = await loadProducts()
  return products.find(product => String(product.id) === String(id)) || null
}

async function create (product) {
  if (!product || typeof product !== 'object') {
    throw new Error('Product data is required')
  }

  const products = await loadProducts()
  const newProduct = {
    id: String(Date.now()),
    ...product
  }

  products.push(newProduct)
  await saveProducts(products)
  return newProduct
}

async function update (id, data) {
  if (!data || typeof data !== 'object') {
    throw new Error('Update data is required')
  }

  const products = await loadProducts()
  const index = products.findIndex(product => String(product.id) === String(id))

  if (index === -1) {
    return null
  }

  products[index] = {
    ...products[index],
    ...data,
    id: String(products[index].id)
  }

  await saveProducts(products)
  return products[index]
}

async function remove (id) {
  const products = await loadProducts()
  const index = products.findIndex(product => String(product.id) === String(id))

  if (index === -1) {
    return false
  }

  products.splice(index, 1)
  await saveProducts(products)
  return true
}
