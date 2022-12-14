const models = require("../models");
const classController = require("./class");

const { announcementModel } = models;

exports.findAllAnnouncements = async function (callback) {
  announcementModel().findAll({}, (error, documents) => {
    if (error) {
      callback(error, null);
    } else {
      callback(null, documents);
    }
  });
};

exports.findAnnouncements = async function (options, callback) {
  switch (options.by) {
    case "visibility":
      announcementModel().find(
        { visibility: options.visibility },
        (error, documents) => {
          if (error) {
            callback(error, null);
          } else {
            callback(null, documents);
          }
        }
      );
      break;

    default:
      callback("invalid query", null);
      break;
  }
};

exports.createAnnouncement = async function (data, options, callback) {
  announcementModel({ ...options })
    .create({ ...data })
    .then((document) => {
      callback(null, document);
    })
    .catch((error) => {
      callback(error, null);
    });
};

exports.findAnnouncementByID = async function (announcementID, callback) {
  announcementModel().findByID(announcementID, (error, document) => {
    if (error) {
      callback(error, null);
    } else {
      callback(null, document);
    }
  });
};

exports.deleteAnnouncementByID = async function (announcementID, callback) {
  announcementModel().deleteOne({ _id: announcementID }, (error) => {
    if (error) {
      callback(error.message);
    } else {
      callback(null);
    }
  });
};

exports.updateAnnouncementByID = async function (
  announcementID,
  options,
  callback
) {
  switch (options.action) {
    case "hide":
      announcementModel().updateOne(
        { _id: announcementID },
        { $set: { isHidden: true } },
        (error) => {
          if (error) {
            callback(error);
          } else {
            callback(null);
          }
        }
      );
      break;
    case "unhide":
      announcementModel().updateOne(
        { _id: announcementID },
        { $set: { isHidden: false } },
        (error) => {
          if (error) {
            callback(error);
          } else {
            callback(null);
          }
        }
      );
      break;
    default:
      callback("Invalid action!");
  }
};
