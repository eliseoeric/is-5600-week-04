const cuid = require('cuid')
const db = require('./db')

// Define Product Model
const Product = db.model('Product', {
  _id: { type: String, default: cuid },
  description: { type: String },
  alt_description: { type: String },
  likes: { type: Number, required: true },
  urls: {
    regular: { type: String, required: true },
    small: { type: String, required: true },
    thumb: { type: String, required: true },
  },
  links: {
    self: { type: String, required: true },
    html: { type: String, required: true },
  },
  user: {
    id: { type: String, required: true },
    first_name: { type: String, required: true },
    last_name: { type: String },
    portfolio_url: { type: String },
    username: { type: String, required: true },
  },
  tags: [{
    title: { type: String, required: true },
  }],
})

// Create a new product
async function create(fields) {
  const product = await new Product(fields).save()
  return product
}

// List products
async function list(options = {}) {
  const { offset = 0, limit = 25, tag } = options

  const query = tag
    ? {
        tags: {
          $elemMatch: {
            title: tag
          }
        }
      }
    : {}

  const products = await Product.find(query)
    .sort({ _id: 1 })
    .skip(offset)
    .limit(limit)

  return products
}

// Get one product by id
async function get(_id) {
  const product = await Product.findById(_id)
  return product
}

// Edit product
async function edit(_id, change) {
  const product = await get(_id)

  Object.keys(change).forEach(function (key) {
    product[key] = change[key]
  })

  await product.save()
  return product
}

// Delete product
async function destroy(_id) {
  return await Product.deleteOne({ _id })
}

module.exports = {
  create,
  list,
  get,
  edit,
  destroy
}