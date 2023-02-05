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
    lowercase: true,
  },
  term: {
    type: String,
    required: true,
    lowercase: true,
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
  electives: [
    {
      title: {
        type: String,
      },
      grade: {
        type: String,
      },
    },
  ],
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
  return this.find()
    .populate([
      { path: "class", select: "-image -password" },
      { path: "student", select: "-image -password" },
    ])
    .exec((error, documents) => {
      if (error) {
        callback(error, null);
      } else {
        callback(null, documents);
      }
    });
});

resultSchema.static("findByID", function (ID, callback) {
  return this.find({ _id: ID }, (error, documents) => {
    if (error) {
      callback(error, null);
    } else {
      if (documents.length === 0) {
        callback(null, null);
      } else {
        callback(null, documents[0]);
      }
    }
  });
});

const Result = mongoose.model("Result", resultSchema);

module.exports = Result;
