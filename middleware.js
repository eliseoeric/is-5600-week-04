function cors(req, res, next) {
  res.setHeader('Access-Control-Allow-Origin', '*');
  next();
}

function handleError(err, req, res, next) {
  console.error(err);
  res.status(500).json({ error: "Internal Error" });
}

function notFound(req, res) {
  res.status(404).json({ error: "Not Found" });
}

module.exports = {
  cors,
  handleError,
  notFound
};