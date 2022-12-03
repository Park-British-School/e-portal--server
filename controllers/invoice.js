const models = require("../models");
const studentController = require("./student");

const { invoiceModel, notificationModel, studentModel } = models;

exports.findAllInvoices = async function (options, callback) {
  invoiceModel.default.find({ type: "DEFAULT" }).exec((error, documents) => {
    if (error) {
      callback(error, null);
    } else {
      callback(null, documents);
    }
  });
};

exports.countAllInvoices = async function (callback) {
  invoiceModel.default
    .countDocuments({ type: "DEFAULT" })
    .exec((error, count) => {
      if (error) {
        callback(error, null);
      } else {
        callback(null, count);
      }
    });
};

exports.findInvoiceByID = async function (invoiceID, callback) {
  invoiceModel.default.findOne(
    { _id: invoiceID, type: "DEFAULT" },
    (error, document) => {
      if (error) {
        callback(error, null);
      } else {
        callback(null, document);
      }
    }
  );
};

exports.createInvoice = async function (data, callback) {
  invoiceModel.default
    .create({ ...data })
    .then((document) => {
      studentModel.findOne({ _id: data.issuedTo }, (error, student) => {
        if (error) {
          invoiceModel.default.deleteOne({ _id: document._id }).exec();
          callback(error.message);
        } else {
          if (student) {
            studentModel.updateOne(
              { _id: student._id },
              { $push: { invoices: document._id } },
              (error) => {
                if (error) {
                  invoiceModel.default.deleteOne({ _id: document._id }).exec();
                  callback(error.message);
                }
              }
            );
          } else {
            invoiceModel.default.deleteOne({ _id: document._id }).exec();
            callback("Student does not exist!");
          }
        }
      });
    })
    .catch((error) => {
      console.log("ERROR: " + error);
      callback(error);
    });
};

exports.updateInvoiceByID = async function (request, response) {
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
};

exports.deleteInvoiceByID = async function (invoiceID, callback) {
  invoiceModel.default.deleteOne(
    { type: "DEFAULT", _id: invoiceID },
    (error) => {
      if (error) {
        callback(error);
      } else {
        callback(null);
      }
    }
  );
};

exports.templates = {
  findAllInvoices: async function (options, callback) {
    invoiceModel.template
      .find({ type: "TEMPLATE" })
      .exec((error, documents) => {
        if (error) {
          callback(error, null);
        } else {
          callback(null, documents);
        }
      });
  },
  countAllInvoices: async function (callback) {
    invoiceModel.template
      .countDocuments({ type: "TEMPLATE" })
      .exec((error, count) => {
        if (error) {
          callback(error, null);
        } else {
          callback(null, count);
        }
      });
  },
  findInvoiceByID: async function (invoiceID, callback) {
    invoiceModel.template.findOne(
      { _id: invoiceID, type: "TEMPLATE" },
      (error, document) => {
        if (error) {
          callback(error, null);
        } else {
          callback(null, document);
        }
      }
    );
  },
  createInvoice: async function (data, callback) {
    invoiceModel.template
      .create({ ...data })
      .then((document) => {
        console.log(document);
        callback(null);
      })
      .catch((error) => {
        console.log("ERROR: " + error);
        callback(error);
      });
  },
  updateInvoiceByID: async function (request, response) {
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
  },
  deleteInvoiceByID: async function (invoiceID, callback) {
    invoiceModel.template.deleteOne(
      { type: "TEMPLATE", _id: invoiceID },
      (error) => {
        if (error) {
          callback(error);
        } else {
          callback(null);
        }
      }
    );
  },
};
