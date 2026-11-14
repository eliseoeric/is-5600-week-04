"use strict";

function cors(req, res, next) {
  const origin = req.headers.origin;
  res.setHeader("Access-Control-Allow-Origin", origin || "*");
  // A wildcard origin cannot be combined with credentialed CORS.
  if (origin) {
    res.vary("Origin");
    res.setHeader("Access-Control-Allow-Credentials", "true");
  }
  res.setHeader("Access-Control-Allow-Methods", "POST, GET, PUT, DELETE, OPTIONS, XMODIFY");
  res.setHeader("Access-Control-Max-Age", "86400");
  res.setHeader("Access-Control-Allow-Headers",
    "X-Requested-With, X-HTTP-Method-Override, Content-Type, Accept");
  if (req.method === "OPTIONS") return res.status(204).end();
  next();
}

function notFound(req, res) {
  res.status(404).json({ error: "Not Found" });
}

function handleError(err, req, res, next) {
  console.error(err);
  if (res.headersSent) return next(err);
  if (err.type === "entity.parse.failed") {
    return res.status(400).json({ error: "Invalid JSON request body" });
  }
  if (err.type === "entity.too.large") {
    return res.status(413).json({ error: "Request body too large" });
  }
  res.status(500).json({ error: "Internal Error Occurred" });
}

module.exports = { cors, notFound, handleError };
