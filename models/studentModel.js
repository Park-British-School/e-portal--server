const mongoose = require('mongoose')

const studentSchema = new mongoose.Schema({
  _id: {
    type: String,
    unique: true,
    lowercase: true,
    trim: true,
    required: true
  },
  firstName: {
    type: String,
    lowercase: true,
    trim: true,
    required: true
  },
  lastName: {
    type: String,
    lowercase: true,
    trim: true,
    required: true
  },
  emailAddress: {
    type: String,
    lowercase: true,
    trim: true,
    required: true
  },
  phoneNumber: {
    type: String,
    trim: true,
    required: true
  },
  gender: {
    type: String,
    lowercase: true,
    enum: ["male", "female"],
    required: true
  },
  password: {
    type: String,
    required: true
  },
  role: {
    type: String,
    lowercase: true,
    default: "student"
  },
  address: {
    type: String,
    required: true
  },
  results: [
    {
      type: mongoose.Types.ObjectId,
      ref: "Result"
    }
  ],
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
}, { collection: 'students', minimize: false })

studentSchema.statics.finds = function (params) {
  return this.find(params)
}

studentSchema.methods.speak = function () {
  console.log('hello')
}

studentSchema.pre('save', function () {

})

const Student = mongoose.model('Student', studentSchema)

module.exports = Student