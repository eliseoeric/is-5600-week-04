module.exports = function validateProduct(req, res, next) {
  const { name, price } = req.body;

  if (!name || price === undefined) {
    return res.status(400).json({ message: "name and price are required" });
  }

  if (typeof price !== "number" || price < 0) {
    return res.status(400).json({ message: "price must be a non-negative number" });
  }

  next();
};
