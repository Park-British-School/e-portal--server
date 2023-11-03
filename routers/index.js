const studentRouter = require("./student.router");
const teacherRouter = require("./teacher.router");
const classRouter = require("./class.router");
const resultRouter = require("./result.router");
const imageRouter = require("./image");
const administratorRouter = require("./administrator.router");
const termRouter = require("./term");
const sessionRouter = require("./session");
const invoiceRouter = require("./invoice");
const feeRouter = require("./fee");
const notificationRouter = require("./notification");
const authRouter = require("./auth.router");
const announcementRouter = require("./announcement");
const variableRouter = require("./variable.router");
const conversation = require("./conversation.router");

module.exports = {
  studentRouter,
  teacherRouter,
  classRouter,
  resultRouter,
  imageRouter,
  administratorRouter,
  termRouter,
  sessionRouter,
  invoiceRouter,
  feeRouter,
  notificationRouter,
  authRouter,
  announcementRouter,
  variableRouter,
  conversation,
};
