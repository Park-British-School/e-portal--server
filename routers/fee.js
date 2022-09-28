const express = require('express')
const controllers = require('../controllers')
const { Router } = express

const {feeController} = controllers

const feeRouter = Router()

feeRouter.get("/", feeController.getAllFees)
feeRouter.post("/", feeController.createFee)
feeRouter.delete("/:feeID", feeController.deleteFee)

module.exports = feeRouter