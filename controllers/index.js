const invoiceController = require("./invoice");
const notificationController = require("./notification");
const administratorController = require("./administrator.controller");
const studentController = require("./student");
const classController = require("./class");
const resultController = require("./result");
const feeController = require("./fee");
const termController = require("./term");
const sessionController = require("./session");
const teacherController = require("./teacher");
const authController = require("./auth.controller");
const announcementController = require("./announcement");
const variableController = require("./variable.controller");

module.exports = {
  invoiceController,
  notificationController,
  administratorController,
  studentController,
  classController,
  resultController,
  feeController,
  termController,
  sessionController,
  teacherController,
  authController,
  announcementController,
  variableController,
};
