const mongoose = require("mongoose");

const resultSchema = mongoose.Schema({
  student: {
    type: String,
    ref: "Student",
    required: true,
  },
  school: {
    type: String,
    required: true,
  },
  title: {
    type: String,
    required: true,
  },
  class: {
    type: mongoose.Types.ObjectId,
    ref: "Class",
    required: true,
  },
  session: {
    type: String,
    required: true,
  },
  term: {
    type: String,
    required: true,
  },
  scoreSheet: {
    type: String,
    required: true,
  },
  overallGrade: {
    type: String,
  },
  overallPercentage: {
    type: Number,
  },
  teachersRemark: {
    type: String,
    required: true,
  },
  teachersRemark: {
    type: String,
    required: true,
  },
  principalsRemark: {
    type: String,
  },
  resumptionDate: {
    type: String,
  },
  gradingScale: {
    type: String,
  },
  uploadedAt: {
    type: Date,
    default: () => new Date().getTime(),
  },
  uploadedBy: {
    type: mongoose.Types.ObjectId,
    required: true,
    ref: "Teacher",
  },
  isApproved: {
    type: Boolean,
    required: true,
    default: false,
  },
  type: {
    type: String,
    required: true,
  },
  comments: {
    type: String,
    default: "N/A",
  },
});

resultSchema.static("findAll", function (callback) {
  return this.find({}, (error, documents) => {
    if (error) {
      callback(error, null);
    } else {
      callback(null, documents);
    }
  });
});

const Result = mongoose.model("Result", resultSchema);

module.exports = Result;
