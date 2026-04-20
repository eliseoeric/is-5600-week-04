const mongoose = require('mongoose')

mongoose.connect(
  process.env.MONGODB_URI || 'mongodb://root:example@localhost:27017/?authSource=admin'
)

module.exports = mongoose