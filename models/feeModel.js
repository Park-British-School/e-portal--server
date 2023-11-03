const mongoose = require("mongoose");

const { Schema, model } = mongoose;

const feeSchema = new Schema({});

const feeSchema__withPriceVariations = new Schema({
  title: { type: String },
  hasPriceVariety: { type: Boolean, default: true },
  prices: [
    {
      variant: { type: String, default: "N/A" },
      price: { type: Number, default: 0 },
    },
  ],
  isGrouped: { type: Boolean, default: false },
  groupName: { type: String, default: "" },
});

const feeSchema__withoutPriceVariations = new Schema({
  title: { type: String },
  hasPriceVariety: { type: Boolean, default: false },
  price: { type: Number, default: 0 },
  isGrouped: { type: Boolean, default: false },
  groupName: { type: String, default: "" },
});

const FeeModel = model("Fee", feeSchema, "fees");

const feeModel__withPriceVariations = model(
  "Fee__withPriceVariations",
  feeSchema__withPriceVariations,
  "fees"
);
const feeModel__withoutPriceVariations = model(
  "Fee__withoutPriceVariations",
  feeSchema__withoutPriceVariations,
  "fees"
);

module.exports = {
  feeModel__withoutPriceVariations,
  feeModel__withPriceVariations,
  FeeModel,
};
