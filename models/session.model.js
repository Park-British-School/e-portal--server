const mongoose = require("mongoose");

const sessionSchema = new mongoose.Schema(
  {
    administrator: {
      type: mongoose.Types.ObjectId,
      ref: "Administrator",
    },
    student: {
      type: String,
      ref: "Administrator",
    },
    teacher: {
      type: mongoose.Types.ObjectId,
      ref: "Administrator",
    },
    accessToken: {
      type: String,
      unique: true,
      required: true,
    },
    createdAt: {
      type: Date,
      default: () => new Date().getTime(),
    },
  },
  { collection: "sessions" }
);

const sessionModel = mongoose.model("Session", sessionSchema);

module.exports = sessionModel;
