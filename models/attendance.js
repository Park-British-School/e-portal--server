const mongoose = require('mongoose')

const { Schema, model } = mongoose

const attendanceSchema = new Schema(
  {
    class: {
      type: String,
      required: true
    },
    term: {
      type: String,
      required: true
    },
    session: {
      type: String,
      required: true
    },
    presentStudents: [
      {
        type: String,
        required: true
      }
    ],
    absentStudents: [
      {
        student: {
          type: String,
        },
        reason: {
          type: String,
        }
      }
    ],
    uploadedAt: {
      type: Date,
      default: new Date().getTime()
    },
    uploadedBy: {
      type: String,
      ref: "Staff"
    },
    populatedFields: {}
  },
  {
    collection: 'attendances',
    minimize: false,
    toJSON: { virtuals: true },
    toObject: { virtuals: true }
  }
)

attendanceSchema.static('findAll', function (options, callback) {
  this.find(
    {},
    (error, document) => {
      callback(error, document)
    }
  ).populate([
    'populatedFields.presentStudents',
    'populatedFields.absentStudents.students',
    'populatedFields.uploadedBy'
  ])
})

attendanceSchema.virtual('populatedFields.presentStudents', {
  ref: "Student",
  localField: "presentStudents",
  foreignField: "id"
})

attendanceSchema.virtual('populatedFields.absentStudents.students', {
  ref: "Student",
  localField: "absentStudents.students",
  foreignField: "id"
})


attendanceSchema.virtual('populatedFields.uploadedBy', {
  ref: "Staff",
  localField: "uploadedBy",
  foreignField: "id"
})

const attendanceModel = model('Attendance', attendanceSchema)

module.exports = attendanceModel