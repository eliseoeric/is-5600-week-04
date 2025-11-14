function validateProduct(req, res, next) {
  const { name, price, category } = req.body;

  if (!name || price === undefined || !category) {
    return res.status(400).json({ error: "name, price and category are required" });
  }

  if (typeof price !== "number") {
    return res.status(400).json({ error: "price must be a number" });
  }

  next();
}

module.exports = validateProduct;
