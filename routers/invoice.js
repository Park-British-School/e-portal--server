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

invoiceRouter.get("/count-all", (request, response) => {
  invoiceController.countAllInvoices((error, count) => {
    if (error) {
      response.status(400).send(error);
    } else {
      response.status(200).send(count.toString());
    }
  });
});

invoiceRouter.get("/find-one", (request, response) => {
  if (request.query.by) {
    if (request.query.by === "ID") {
      invoiceController.findInvoiceByID(request.query.ID, (error, invoice) => {
        if (error) {
          response.status(400).send(error);
        } else {
          if (invoice) {
            response.status(200).json(invoice);
          } else {
            response.status(400).send("Invoice not found!");
          }
        }
      });
    }
  } else {
    response.status(400).send("Incorrect query parameters");
  }
});

invoiceRouter.post("/create", (request, response) => {
  invoiceController.createInvoice({ ...request.body }, (error) => {
    if (error) {
      response.status(400).send(error);
    } else {
      response.status(200).end();
    }
  });
});

invoiceRouter.get("/:ID/update", (request, response) => {
  invoiceController.updateInvoiceByID(request.params.ID, (error) => {
    if (error) {
      response.status(400).send(error);
    } else {
      response.status(200).end();
    }
  });
});

invoiceRouter.get("/:ID/delete", (request, response) => {
  invoiceController.deleteInvoiceByID(request.params.ID, (error) => {
    if (error) {
      response.status(400).send(error);
    } else {
      response.status(200).end();
    }
  });
});

invoiceRouter.get("/templates/find-all", (request, response) => {
  invoiceController.templates.findAllInvoices({}, (error, invoices) => {
    if (error) {
      response.status(400).send(error);
    } else {
      response.status(200).json(invoices);
    }
  });
});

invoiceRouter.get("/templates/count-all", (request, response) => {
  invoiceController.templates.countAllInvoices((error, count) => {
    if (error) {
      response.status(400).send(error);
    } else {
      response.status(200).send(count.toString());
    }
  });
});

invoiceRouter.get("/templates/find-one", (request, response) => {
  if (request.query.by) {
    if (request.query.by === "ID") {
      invoiceController.templates.findInvoiceByID(
        request.query.ID,
        (error, invoice) => {
          if (error) {
            response.status(400).send(error);
          } else {
            if (invoice) {
              response.status(200).json(invoice);
            } else {
              response.status(400).send("Invoice not found!");
            }
          }
        }
      );
    }
  } else {
    response.status(400).send("Incorrect query parameters");
  }
});

invoiceRouter.post("/templates/create", (request, response) => {
  invoiceController.templates.createInvoice({ ...request.body }, (error) => {
    if (error) {
      response.status(400).send(error);
    } else {
      response.status(200).end();
    }
  });
});

invoiceRouter.get("/templates/:ID/update", (request, response) => {
  invoiceController.templates.updateInvoiceByID(request.params.ID, (error) => {
    if (error) {
      response.status(400).send(error);
    } else {
      response.status(200).end();
    }
  });
});

invoiceRouter.get("/templates/:ID/delete", (request, response) => {
  invoiceController.templates.deleteInvoiceByID(request.params.ID, (error) => {
    if (error) {
      response.status(400).send(error);
    } else {
      response.status(200).end();
    }
  });
});

module.exports = invoiceRouter;
