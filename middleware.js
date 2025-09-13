function cors(req, res, next) {
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.setHeader("Access-Control-Allow-Methods", "GET, POST, PUT, DELETE, OPTIONS");
  res.setHeader("Access-Control-Allow-Headers", "Content-Type");
  next();
}

function errorHandler(err, req, res, next) {
  console.error("🔥 Error:", err);
  res.status(500).json({ error: "Internal Server Error" });
}

function notFound(req, res) {
  res.status(404).json({ error: "Route not found" });
}

module.exports = { cors, errorHandler, notFound };
