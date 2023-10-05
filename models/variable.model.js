const mongoose = require("mongoose");

const variableSchema = new mongoose.Schema(
  {
    key: {
      type: String,
      required: true,
      unique: true,
    },
    value: {
      type: mongoose.Schema.Types.Mixed,
      required: true,
      default: "n/a",
    },
  },
  { collection: "variables" }
);

const variableModel = mongoose.model("Variable", variableSchema);

module.exports = variableModel;
