const mongoose = require('mongoose')

const teacherSchema = new mongoose.Schema({
  firstName: {
    type: String,
    required: true
  },
  lastName: {
    type: String,
    required: true
  },
  gender: {
    type: String,
    lowercase: true,
    enum: ["male", "female"],
    required: true,
  },
  maritalStatus: {
    type: String,
    lowercase: true,
    enum: ["single", "married"],
    required: true
  },
  email: {
    type: String,
    required: true
  },
  password: {
    type: String,
    required: true
  },
  role: {
    type: String,
    lowercase: true,
    default: "teacher"
  },
  address: {
    type: String,
    required: true
  },
  status: {
    type: String,
    default: "active"
  },
  createdAt: {
    type: Date,
    default: () => new Date().getTime()
  },
  lastSeen: {
    type: Date,
    default: () => new Date().getTime()
  }
})

const Teacher = mongoose.model('Teacher', teacherSchema)

module.exports = Teacher