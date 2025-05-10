const express = require('express')
const router = express.Router()
const products = require('../services/products')

// GET all products
router.get('/products', (req, res, next) => {
  try {
    const { limit, offset, tag } = req.query
    const result = products.getAll({ limit, offset, tag })
    res.json(result)
  } catch (err) {
    next(err)
  }
})

// GET one product
router.get('/products/:id', (req, res, next) => {
  try {
    const product = products.getById(req.params.id)
    if (!product) return res.status(404).json({ error: 'Product not found' })
    res.json(product)
  } catch (err) {
    next(err)
  }
})

// POST - Create product
router.post('/products', (req, res, next) => {
  try {
    const newProduct = products.createProduct(req.body)
    res.status(201).json(newProduct)
  } catch (err) {
    next(err)
  }
})

// PUT - Update product
router.put('/products/:id', (req, res, next) => {
  try {
    const updated = products.updateProduct(req.params.id, req.body)
    if (!updated) return res.status(404).json({ error: 'Product not found' })
    res.json(updated)
  } catch (err) {
    next(err)
  }
})

// DELETE - Remove product
router.delete('/products/:id', (req, res, next) => {
  try {
    const deleted = products.deleteProduct(req.params.id)
    if (!deleted) return res.status(404).json({ error: 'Product not found' })
    res.status(204).send()
  } catch (err) {
    next(err)
  }
})

module.exports = router
