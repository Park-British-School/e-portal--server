const mongoose = require("mongoose");

const passwordResetPinSchema = new mongoose.Schema(
  {
    administrator: {
      type: "String",
      ref: "Admin",
    },
    pin: {
      type: String,
      unique: true,
      lowercase: true,
    },
    createdAt: {
      type: Date,
      default: Date.now(),
    },
  },
  { collection: "password_reset_pins" }
);

const passwordResetPinModel = mongoose.model(
  "PasswordResetPin",
  passwordResetPinSchema
);

module.exports = passwordResetPinModel;
