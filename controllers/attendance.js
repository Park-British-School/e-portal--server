const models = require("../models");

const { attendanceModel } = models;

exports.findAllAttendances = async function (callback) {
  attendanceModel.findAll({}, (error, documents) => {
    if (error) {
      callback(error, null);
    } else {
      callback(null, documents);
    }
  });
};

exports.createAttendance = async function (data, callback) {
  attendanceModel
    .create({ ...data })
    .then((document) => {
      callback(null, document);
    })
    .catch((error) => {
      callback(error, null);
    });
};

exports.findAttendanceByID = async function (attendanceID, callback) {
  attendanceModel.findById(attendanceID, (error, document) => {
    if (error) {
      callback(error, null);
    } else {
      if (document) {
        callback(null, document);
      } else {
        callback("This attendance does not exist", null);
      }
    }
  });
};
