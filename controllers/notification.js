const models = require("../models");

const { notificationModel } = models;

async function getAll(request, response) {
  notificationModel().find({}, (error, document) => {
    response.status(200).json(document);
  });
}

async function create(request, response) {
  notificationModel("NEW_INVOICE").create(
    { recipient: "tttttt" },
    (error, document) => {
      response.status(200).json(document);
    }
  );
}

async function getByID(request, response) {}

async function deleteByID(request, response) {
  let notificationID = request.params.notificationID;
  console.log(request.query.type);
  notificationModel().findByIdAndDelete(notificationID, (error, document) => {
    response.status(200).json(document);
  });
}

async function updateByID(request, response) {
  let notificationID = request.params.notificationID;
  notificationModel(request.body.type).findByIdAndUpdate(
    notificationID,
    { $set: { ...request.body } },
    { new: true },
    (error, document) => {
      response.status(200).json(document);
    }
  );
}

async function deleteManyByID(request, response) {}

module.exports = {
  getAll,
  create,
  getByID,
  deleteByID,
  updateByID,
  deleteManyByID,
};
