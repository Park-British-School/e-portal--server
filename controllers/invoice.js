const models = require("../models");
const studentController = require("./student");

const { invoiceModel, notificationModel, studentModel } = models;

async function getByID(request, response, next) {
  let invoice = request.payload.invoice;
  response.status(200).json(invoice);
}

async function editByID(request, response) {
  let invoice = request.payload.invoice;
  invoiceModel(request.body.invoice.type)
    .findByIdAndUpdate(
      invoice._id,
      { $set: { ...request.body } },
      { new: true },
      (error, document) => {
        if (error) {
          response.status(400).send(error.message);
        }
        response.status(200).json(document);
      }
    )
    .populate("issuedTo");
}

async function deleteByID(request, response) {
  let invoice = request.payload.invoice;
  invoiceModel()
    .findByIdAndDelete(invoice._id, (error, document) => {
      if (error) {
        response.status(400).send(error.message);
      }
      response.status(200).json(document);
    })
    .populate("issuedTo");
}

async function create(request, response) {
  invoiceModel(request.body.type).create(
    { ...request.body },
    (error, document) => {
      if (error) {
        response.status(400).send(error);
      } else {
        if (request.body.type === "DRAFT_INVOICE") {
          response.status(200).json(document);
        } else {
          studentModel.updateOne(
            { _id: document.issuedTo },
            { $push: { invoices: document._id } },
            (error) => {
              if (error) {
                response.status(400).send(error);
              } else {
                response.status(200).json(document);
              }
            }
          );
        }
      }
    }
  );
}

async function getAll(request, response) {
  invoiceModel()
    .find((error, documents) => {
      response.status(200).json(documents);
    })
    .populate(["issuedTo"]);
}

async function deleteAll(request, response) {}

async function findAllInvoices(options, callback) {
  if (options.paginate) {
    invoiceModel()
      .find()
      .sort({
        firstName: "asc",
      })
      .populate([
        { path: "class", select: "-image -password" },
        { path: "student", select: "-image -password" },
        { path: "uploadedBy", select: "-image -password" },
      ])
      .limit(options.count)
      .skip(options.count * (options.page - 1))
      .exec(function (error, results) {
        callback(null, results);
      });
  } else {
    invoiceModel().find({}, (error, documents) => {
      if (error) {
        callback(error, null);
      } else {
        callback(null, documents);
      }
    });
  }
}

async function findInvoiceByID(invoiceID, callback) {
  invoiceModel()
    .findOne({ _id: invoiceID })
    .populate(["issuedTo"])
    .exec((error, document) => {
      if (error) {
        callback(error, null);
      } else {
        callback(null, document);
      }
    });
}

async function createInvoice(options, data, callback) {
  invoiceModel({ type: options.type })
    .create({ ...data })
    .then((document) => {
      if (document.type === "INVOICE") {
        studentController.findStudentByID(
          document.issuedTo,
          (error, student) => {
            if (error) {
              callback(error);
            } else {
              if (student) {
                studentModel.updateOne(
                  { _id: student._id },
                  { $push: { invoices: document._id } },
                  (error) => {
                    if (error) {
                      callback(errror);
                    } else {
                      callback(null);
                    }
                  }
                );
              } else {
                callback("Student does not exist");
              }
            }
          }
        );
      }
    })
    .catch((error) => {
      callback(error.message);
    });
}

module.exports = {
  create,
  findInvoiceByID,
  getByID,
  editByID,
  deleteByID,
  getAll,
  deleteAll,
  findAllInvoices,
  createInvoice,
};
