const express = require("express");
const controllers = require("../controllers");

const { Router } = express;
const { invoiceController } = controllers;
const {
  findInvoiceByID,
  getByID,
  editByID,
  deleteByID,
  getAll,
  deleteAll,
  create,
} = invoiceController;

const invoiceRouter = Router();

// invoiceRouter.param("invoiceID", findInvoiceByID);

// invoiceRouter.route("/").get(getAll).post(create).delete(deleteAll);

// invoiceRouter
//   .route("/:invoiceID")
//   .get(getByID)
//   .patch(editByID)
//   .delete(deleteByID);

invoiceRouter.get("/find-all", (request, response) => {
  invoiceController.findAllInvoices(
    {
      paginate: request.query.paginate === "true" ? true : false,
    },
    (error, invoices) => {
      if (error) {
        response.status(400).send(error);
      } else {
        response.status(200).json(invoices);
      }
    }
  );
});

invoiceRouter.get("/find-one", (request, response) => {
  if (request.query.by) {
    if (request.query.by === "ID") {
      invoiceController.findInvoiceByID(request.query.ID, (error, invoice) => {
        if (error) {
          response.status(400).send(error);
        } else {
          response.status(200).json(invoice);
        }
      });
    }
  } else {
    response.status(400).send("Incorrect query parameters");
  }
});

invoiceRouter.post("/create", (request, response) => {
  invoiceController.createInvoice(
    { type: request.query.type },
    { ...request.body },
    (error) => {
      if (error) {
        response.status(400).send(error);
      } else {
        response.status(200).end();
      }
    }
  );
});

module.exports = invoiceRouter;
