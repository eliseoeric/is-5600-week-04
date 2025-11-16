const path = require('path');
const fs = require('fs').promises;
const dataPath = path.resolve(__dirname, '../data/full-products.json');

async function listPrints(req, res, next) {
  try {
    let prints = JSON.parse(await fs.readFile(dataPath));
    if (req.query.tag) prints = prints.filter(p => p.tags.includes(req.query.tag));
    const offset = Number(req.query.offset || 0);
    const limit = Number(req.query.limit || 24);
    res.json({ items: prints.slice(offset, offset + limit), total: prints.length });
  } catch (err) { next(err); }
}

async function getPrint(req, res, next) {
  try {
    const prints = JSON.parse(await fs.readFile(dataPath));
    const item = prints.find(p => p.id === req.params.id);
    if (!item) return res.status(404).json({ error: 'Print not found' });
    res.json(item);
  } catch (err) { next(err); }
}

function createPrint(req, res) {
  res.status(201).json({ message: 'Create endpoint reached', data: req.body });
}

function updatePrint(req, res) {
  res.json({ message: `Updated print with id ${req.params.id}`, data: req.body });
}

function deletePrint(req, res) {
  res.status(202).json({ message: `Deleted print with id ${req.params.id}` });
}

module.exports = { listPrints, getPrint, createPrint, updatePrint, deletePrint };
