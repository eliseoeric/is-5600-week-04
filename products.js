// products.js
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

       return product.tags.find(( {title} ) => title == tag)
  })
  .slice(offset, offset + limit)
}

async function get (id) {
  const products = JSON.parse(await fs.readFile(productsFile))
}

async function updateProduct(req, res) {
  const { id } = req.params

  const updated = await Products.update(id, req.body)
  console.log("Product updated:", id)

  res.status(200).json({
    message: "Product updated",
    product: updated
  })
}

async function deleteProduct(req, res) {
  const { id } = req.params

  await Products.delete(id)
  console.log("Product deleted:", id)

  res.status(202).json({ message: "Product deleted" })
}

module.exports = {
  list,
  get,
  update,
  delete: deleteProduct
}