const studentRouter = require("./student");
const teacherRouter = require("./teacher");
const classRouter = require("./class");
const resultRouter = require("./result");
const imageRouter = require("./image");
const administratorRouter = require("./administrator.router");
const termRouter = require("./term");
const sessionRouter = require("./session");
const invoiceRouter = require("./invoice");
const feeRouter = require("./fee");
const notificationRouter = require("./notification");
const authRouter = require("./auth");
const announcementRouter = require("./announcement");

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
};
