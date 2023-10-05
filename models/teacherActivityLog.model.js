const mongoose = require("mongoose");

const teacherActivityLogSchema = new mongoose.Schema(
  {
    teacher: {
      $type: String,
      required: true,
      ref: "Teacher",
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
  { typeKey: "$type", collection: "teacher_activity_logs" }
);


const teacherActivityLogModel = mongoose.model("TeacherActivityLog", teacherActivityLogSchema)

module.exports = teacherActivityLogModel