// MOCK update: just log and return 200
function updateProduct(req, res) {
  const { id } = req.params;
  const update = req.body || {};
  console.log(`(mock) Product ${id} updated with:`, update);
  return res.status(200).json({
    message: 'Product updated (mock)',
    id,
    update
  });
}

// MOCK delete: just log and return 202
function deleteProduct(req, res) {
  const { id } = req.params;
  console.log(`(mock) Product ${id} deleted`);
  return res.status(202).json({
    message: 'Product deleted (mock)',
    id
  });
}

module.exports = { updateProduct, deleteProduct };