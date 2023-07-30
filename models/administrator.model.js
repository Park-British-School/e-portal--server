const mongoose = require("mongoose");

const administratorSchema = new mongoose.Schema(
  {
    firstName: {
      type: String,
      required: true,
    },
    lastName: {
      type: String,
      required: true,
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
      required: true,
    },
    email: {
      type: String,
      required: true,
    },
    password: {
      type: String,
      required: true,
    },
    role: {
      type: String,
      lowercase: true,
      default: "admin",
    },
    homeAddress: {
      type: String,
    },
    status: {
      type: String,
      default: "active",
    },
  },
  { collection: "admins" }
);

const administratorModel = mongoose.model("Administrator", administratorSchema);

module.exports = administratorModel;
