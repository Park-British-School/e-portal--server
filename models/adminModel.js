const mongoose = require('mongoose')

const adminSchema = new mongoose.Schema({
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
    default: "admin"
  },
  address: {
    type: String,
    required: true
  }
})

const Admin = mongoose.model('Admin', adminSchema)

module.exports = Admin