const mongoose = require('mongoose')
const classSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true
  },
  teachers: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Teacher'
    }
  ],
  subjects: [
    {
      type: String
    }
  ],
  students: [
    {
      type: String,
      ref: 'Student'
    }
  ],
})

const Class = mongoose.model('Class', classSchema)

module.exports = Class;