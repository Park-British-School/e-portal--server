const express = require('express')
const controllers = require("../controllers")

const { Router } = express
const { invoiceController } = controllers
const {
  findInvoiceByID,
  getByID,
  editByID,
  deleteByID,
  getAll,
  deleteAll,
  create
} = invoiceController

const invoiceRouter = Router()

invoiceRouter.param("invoiceID", findInvoiceByID)

invoiceRouter.route("/")
  .get(getAll)
  .post(create)
  .delete(deleteAll)

invoiceRouter.route("/:invoiceID")
  .get(getByID)
  .patch(editByID)
  .delete(deleteByID)


module.exports = invoiceRouter
