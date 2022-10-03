const invoiceController = require("./invoice");
const notificationController = require("./notification");
const adminController = require("./admin");
const studentController = require("./student");
const classController = require("./class");
const resultController = require("./result");
const feeController = require("./fee");
const termController = require("./term");
const sessionController = require("./session");
const teacherController = require('./teacher')
const authController = require('./auth')

module.exports = {
  invoiceController,
  notificationController,
  adminController,
  studentController,
  classController,
  resultController,
  feeController,
  termController,
  sessionController,
  teacherController,
  authController
};
