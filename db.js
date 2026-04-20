const mongoose = require('mongoose')

mongoose.connect(
  process.env.MONGODB_URI || 'mongodb://root:example@127.0.0.1:27017/?authSource=admin'
)

module.exports = mongoose