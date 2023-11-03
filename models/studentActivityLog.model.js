const mongoose = require("mongoose");

const studentActivityLogSchema = new mongoose.Schema(
  {
    student: {
      $type: String,
      required: true,
      ref: "Student",
    },
    type: {
      $type: String,
      enum: ["sign_in"],
      required: true,
    },
    createdAt: {
      $type: Date,
      default: () => new Date().getTime(),
    },
  },
  { typeKey: "$type", collection: "student_activity_logs" }
);

const studentActivityLogModel = mongoose.model(
  "StudentActivityLog",
  studentActivityLogSchema
);

module.exports = studentActivityLogModel;
