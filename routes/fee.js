const express = require('express')
const {
  getAllFees,
  createFee,
  deleteFee,
  getAllInvoices,
} = require("../controllers/billingController")
const { Router } = express

const feeRouter = Router()

feeRouter.get("/", getAllFees)
feeRouter.post("/", createFee)
feeRouter.delete("/:feeID", deleteFee)

module.exports = feeRouter