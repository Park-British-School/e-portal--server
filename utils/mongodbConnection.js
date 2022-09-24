const mongoose = require('mongoose')

function connectMongodb(uri) {
  mongoose.connect(
    process.env.MONGOURI,
    { useNewUrlParser: true, useUnifiedTopology: true }
  )
}

module.exports = connectMongodb