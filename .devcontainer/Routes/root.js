const path = require('path');
function rootHandler(req, res) {
  res.sendFile(path.resolve(__dirname, '../index.html'));
}
module.exports = { rootHandler };
