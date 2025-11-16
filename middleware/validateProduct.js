module.exports = function validateProduct(req, res, next) {
  const { name, price, inventory } = req.body;

  if (!name || typeof name !== 'string') {
    return res.status(400).json({ error: "Invalid or missing 'name'" });
  }
  if (price === undefined || typeof price !== 'number') {
    return res.status(400).json({ error: "Invalid or missing 'price'" });
  }
  if (inventory === undefined || typeof inventory !== 'number') {
    return res.status(400).json({ error: "Invalid or missing 'inventory'" });
  }

  next();
};
