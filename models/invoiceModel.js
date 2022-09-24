const mongoose = require('mongoose')
const { Schema, model } = mongoose

const feeSchema = new Schema({
  name: { type: String },
  amount: {
    type: Number,
    required: true
  },
  hasVariant: {
    type: String,
    required: true,
    default: false
  },
  variant: { type: String }
})

const invoiceSchema = new Schema({
  status: {
    type: String,
    default: "Unpaid",
    enum: ["Unpaid", "Paid", "Overdue"]
  },
  hasDueDate: {
    type: Boolean,
    default: false
  },
  dueDate: {
    type: Date,
  },
  fees: [feeSchema],
  issuedTo: {
    type: String,
    ref: "Student"
  },
  issuedAt: {
    type: Date,
    default: new Date().getTime()
  },
  type: { type: String, default: "INVOICE" }
})

const draftInvoiceSchema = new Schema({
  title: { type: String, required: true },
  fees: [feeSchema],
  type: { type: String, default: "DRAFT_INVOICE" }
})

module.exports = function (type) {
  switch (type) {
    case "DRAFT_INVOICE":
      return model("DraftInvoice", draftInvoiceSchema, "invoices");
    default:
      return model("Invoice", invoiceSchema, "invoices");
  }
}