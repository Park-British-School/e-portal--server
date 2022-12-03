const mongoose = require("mongoose");
const { Schema, model } = mongoose;

const feeSchema = new Schema({
  title: { type: String, required: true },
  subTitle: { type: String },
  amount: {
    type: Number,
    required: true,
  },
});

const invoiceSchema = {
  default: new mongoose.Schema(
    {
      fees: [feeSchema],
      type: {
        type: String,
        required: true,
        default: "DEFAULT",
      },
      issuedTo: {
        type: String,
        required: true,
        ref: "Student",
      },
      issuedAt: {
        type: Date,
        default: new Date().getTime(),
      },
      status: {
        type: String,
        default: "Unpaid",
        enum: {
          values: ["Unpaid", "Paid", "Overdue", "PartPayment"],
          message: "{VALUE} is not a valid option for status",
        },
      },
    },
    { collection: "invoices" }
  ),
  template: new mongoose.Schema(
    {
      fees: [feeSchema],
      type: { type: String, default: "TEMPLATE" },
      title: { type: String, required: true },
    },
    { collection: "invoices" }
  ),
  draft: new mongoose.Schema(
    {
      fees: [feeSchema],
      type: { type: String, default: "DRAFT" },
      issuedTo: {
        type: String,
        ref: "Student",
      },
      status: {
        type: String,
        default: "Unpaid",
        enum: {
          values: ["Unpaid", "Paid", "Overdue", "PartPayment"],
          message: "{VALUE} is not a valid option for status",
        },
      },
    },
    { collection: "invoices" }
  ),
};

module.exports = {
  default: mongoose.model("INVOICE_DEFAULT", invoiceSchema.default),
  template: mongoose.model("INVOICE_TEMPLATE", invoiceSchema.template),
  draft: mongoose.model("INVOICE_DRAFT", invoiceSchema.draft),
};
