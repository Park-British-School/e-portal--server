const invoiceModel = require("./invoiceModel");
const notificationModel = require("./notification");
const announcementModel = require("./announcement");
const studentModel = require("./studentModel");
const administratorModel = require("./administrator.model");
const resultModel = require("./result.model");
const passwordResetPinModel = require("./passwordResetPin.model");
const teacherModel = require("./teacherModel");
const classModel = require("./classModel");
const administratorActivityLogModel = require("./administratorActivityLog.model");
const studentActivityLogModel = require("./studentActivityLog.model");
const teacherActivityLogModel = require("./teacherActivityLog.model");
const sessionModel = require("./session.model");
const variableModel = require("./variable.model");
const conversation = require("./conversation.model");
const student = require("./studentModel");
const result = require("./result.model")

module.exports = {
  invoiceModel,
  notificationModel,
  announcementModel,
  studentModel,
  administratorModel,
  resultModel,
  passwordResetPinModel,
  teacherModel,
  classModel,
  administratorActivityLogModel,
  sessionModel,
  variableModel,
  teacherActivityLogModel,
  studentActivityLogModel,
  conversation,
  student,
  result
};
