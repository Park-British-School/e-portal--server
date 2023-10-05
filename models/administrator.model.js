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
      default: "male",
    },
    maritalStatus: {
      type: String,
      lowercase: true,
      enum: ["single", "married", "divorced"],
      required: true,
      default: "single",
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
    secondaryRole: {
      type: String,
      lowercase: true,
      required: true,
      default: "administrator",
    },
    homeAddress: {
      type: String,
    },
    status: {
      type: String,
      default: "active",
    },
    isDeleted: {
      type: Boolean,
      required: true,
      default: false,
    },
    isBanned: {
      type: Boolean,
      required: true,
      default: false,
    },
    image: {
      type: String,
    },
  },
  { collection: "admins" }
);

const administratorModel = mongoose.model("Administrator", administratorSchema);

module.exports = administratorModel;
