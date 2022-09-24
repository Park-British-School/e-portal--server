const { Schema, model } = require('mongoose')

const termSchema = new Schema({
  name: {
    type: String,
    required: true
  }
}, { collection: "term" })

const Term = model("Term", termSchema)

module.exports = Term