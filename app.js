const fs = require('fs').promises
const path = require('path')
const express = require('express')

const app = express()
const port = 3000

app.use(express.json())

const productsFile = path.join(__dirname, 'data/full-products.json')

let products = []

async function loadProducts() {
  const data = await fs.readFile(productsFile)
  products = JSON.parse(data)
}

loadProducts()

// GET all products
app.get('/products', (req, res) => {
  res.json(products)
})

// GET single product
app.get('/products/:id', (req, res) => {
  const id = req.params.id
  const product = products.find(p => p.id === id)

  if (!product) {
    return res.status(404).json({ error: 'Product not found' })
  }

  res.json(product)
})

// CREATE product
app.post('/products', (req, res) => {
  const newProduct = req.body
  products.push(newProduct)

  res.status(201).json(newProduct)
})

// UPDATE product
app.put('/products/:id', (req, res) => {
  const id = req.params.id
  const index = products.findIndex(p => p.id === id)

  if (index === -1) {
    return res.status(404).json({ error: 'Product not found' })
  }

  products[index] = { ...products[index], ...req.body }

  res.json(products[index])
})

// DELETE product
app.delete('/products/:id', (req, res) => {
  const id = req.params.id
  const index = products.findIndex(p => p.id === id)

  if (index === -1) {
    return res.status(404).json({ error: 'Product not found' })
  }

  products.splice(index, 1)

  res.json({ message: 'Deleted successfully' })
})

app.listen(port, () => {
  console.log(`Server running on http://localhost:${port}`)
})
