const mongoose = require("mongoose");
const { Schema, model } = mongoose;

const feeSchema = new Schema({
  name: { type: String },
  amount: {
    type: Number,
    required: true,
  },
  hasVariant: {
    type: String,
    required: true,
    default: false,
  },
  variant: { type: String },
});

const invoiceSchema = new Schema({
  fees: [feeSchema],
  type: { type: String, default: "INVOICE" },
});

module.exports = function (options) {
  if (options) {
    if (options.type === "TEMPLATE") {
      invoiceSchema.add({
        title: { type: String, required: true },
      });
      invoiceSchema.remove(["issuedTo", "issuedAt", "status"]);
    }
    if (options.type === "INVOICE") {
      invoiceSchema.add({
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
          enum: ["Unpaid", "Paid", "Overdue", "PartPayment"],
        },
      });
      invoiceSchema.remove("title");
    }
    if (options.type === "DRAFT") {
      invoiceSchema.add({
        issuedTo: {
          type: String,
          required: true,
        },
        status: {
          type: String,
          default: "Unpaid",
          enum: ["Unpaid", "Paid", "Overdue", "PartPayment"],
        },
      });
      invoiceSchema.remove(["title", "issuedAt"]);
    }
  }
  return model("Invoice", invoiceSchema);
};
