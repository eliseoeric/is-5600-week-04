const express = require('express');
const { list, getById, create, update, remove } = require('../services/products');
const router = express.Router();

router.get('/', list);
router.get('/:id', getById);
router.post('/', create);
router.put('/:id', update);
router.delete('/:id', remove);

module.exports = { productsRouter: router };
