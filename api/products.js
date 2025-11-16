const express = require('express');
const route = express.Router();
const { listPrints, getPrint, createPrint, updatePrint, deletePrint } = require('../services/prints');
route.get('/', listPrints);
route.get('/:id', getPrint);
route.post('/', createPrint);
route.put('/:id', updatePrint);
route.delete('/:id', deletePrint);
module.exports = { router: route };
