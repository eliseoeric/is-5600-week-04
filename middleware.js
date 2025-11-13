function cors(req, res, next) {
  res.setHeader('Access-Control-Allow-Origin', req.headers.origin || '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET,POST,PUT,DELETE,OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type,Accept');
  next();
}
function notFound(req, res) {
  res.status(404).json({ error: 'Not Found' });
}
function handleError(err, req, res, next) {
  console.error(err);
  res.status(500).json({ error: 'Internal Server Error' });
}
module.exports = { cors, notFound, handleError };
