// middleware.js

// CORS Middleware
function cors(req, res, next) {
  const origin = req.headers.origin;

  res.setHeader("Access-Control-Allow-Origin", origin || "*");
  res.setHeader(
    "Access-Control-Allow-Methods",
    "GET,POST,PUT,DELETE,OPTIONS"
  );
  res.setHeader(
    "Access-Control-Allow-Headers",
    "Content-Type, Accept, X-Requested-With"
  );

  next();
}

// Error Handler
function handleError(err, req, res, next) {
  console.error("SERVER ERROR →", err);

  if (res.headersSent) return next(err);

  res.status(500).json({ error: "Internal Error Occurred" });
}

// 404 Handler
function notFound(req, res) {
  res.status(404).json({ error: "Not Found" });
}

module.exports = {
  cors,
  handleError,
  notFound
};
