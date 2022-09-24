const models = require('../models')

const { invoiceModel, notificationModel } = models

async function findInvoiceByID(request, response, next) {
  let invoiceID = request.params.invoiceID
  request.payload = {}
  invoiceModel(request.body.type).findById(invoiceID,
    (error, document) => {
      if (document) {
        request.payload.invoice = document
        next()
      }
      else {
        response.status(400).send("Invoice does not exist")
      }
    }
  ).populate('issuedTo')
}

async function getByID(request, response, next) {

  let invoice = request.payload.invoice
  response.status(200).json(invoice)
}

async function editByID(request, response) {
  let invoice = request.payload.invoice
  invoiceModel(request.body.invoice.type).findByIdAndUpdate(
    invoice._id,
    { $set: { ...request.body } },
    { new: true },
    (error, document) => {
      if (error) {
        response.status(400).send(error.message)
      }
      response.status(200).json(document)
    }
  )
    .populate('issuedTo')
}

async function deleteByID(request, response) {
  let invoice = request.payload.invoice
  invoiceModel().findByIdAndDelete(
    invoice._id,
    (error, document) => {
      if (error) {
        response.status(400).send(error.message)
      }
      response.status(200).json(document)
    }
  ).populate('issuedTo')
}

async function create(request, response) {
  invoiceModel(request.body.type).create({ ...request.body },
    (error, document) => {
      if (error) {
        response.status(400).send(error.message)
      }
      if (request.body.type !== "DRAFT_INVOICE") {
        notificationModel("NEW_INVOICE").create({
          recipient: document.issuedTo,
          invoiceID: document._id
        })
      }
      response.status(200).json(document)
    }
  )
}

async function getAll(request, response) {
  invoiceModel().find((error, documents) => {
    response.status(200).json(documents)
  }).populate('issuedTo')
}

async function deleteAll(request, response) {

}

module.exports = {
  create,
  findInvoiceByID,
  getByID,
  editByID,
  deleteByID,
  getAll,
  deleteAll
}