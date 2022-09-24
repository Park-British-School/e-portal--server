const {Schema, model} = require('mongoose')

const sessionSchema = new Schema({
  name: {
    type: String,
    required: true
  }
}, {collection: "session"})

const Session = model("Sesssion", sessionSchema)

module.exports = Session

