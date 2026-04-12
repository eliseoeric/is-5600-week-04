const { randomUUID } = require('crypto')

const products = [
  {
    id: randomUUID(),
    name: 'Abstract Print',
    price: 18.99,
    tags: ['abstract', 'art']
  },
  {
    id: randomUUID(),
    name: 'Texture Study',
    price: 24.5,
    tags: ['texture', 'design']
  },
  {
    id: randomUUID(),
    name: 'Color Field Poster',
    price: 30.0,
    tags: ['color', 'poster']
  },
  {
    id: randomUUID(),
    name: 'Minimalist Print',
    price: 15.0,
    tags: ['minimal', 'art']
  },
  {
    id: randomUUID(),
    name: 'Vintage Poster',
    price: 22.75,
    tags: ['vintage', 'print']
  },
  {
    id: randomUUID(),
    name: 'Geometric Art',
    price: 27.5,
    tags: ['geometry', 'abstract']
  }
]

module.exports = {
  list,
  getById,
  create,
  update,
  remove
}

function list(options = {}) {
  const { offset = 0, limit = 25, tag } = options
  const normalizedTag = typeof tag === 'string' ? tag.trim().toLowerCase() : ''

  const filtered = normalizedTag
    ? products.filter(product =>
        Array.isArray(product.tags) &&
        product.tags.some(item => item.toLowerCase() === normalizedTag)
      )
    : products

  return {
    total: filtered.length,
    offset,
    limit,
    products: filtered.slice(offset, offset + limit)
  }
}

function getById(id) {
  return products.find(product => product.id === id)
}

function create(productData) {
  const product = {
    id: randomUUID(),
    name: productData.name.trim(),
    price: productData.price,
    tags: Array.isArray(productData.tags)
      ? productData.tags.map(String)
      : []
  }

  products.push(product)
  return product
}

function update(id, updates) {
  const product = getById(id)
  if (!product) {
    return null
  }

  if (typeof updates.name === 'string') {
    product.name = updates.name.trim()
  }

  if (typeof updates.price === 'number') {
    product.price = updates.price
  }

  if (Array.isArray(updates.tags)) {
    product.tags = updates.tags.map(String)
  }

  return product
}

function remove(id) {
  const index = products.findIndex(product => product.id === id)
  if (index === -1) {
    return false
  }

  products.splice(index, 1)
  return true
}
