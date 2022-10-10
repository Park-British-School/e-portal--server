const studentRouter = require("./student");
const teacherRouter = require("./teacher");
const classRouter = require("./class");
const resultRouter = require("./result");
const imageRouter = require("./image");
const adminRouter = require("./admin");
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
  adminRouter,
  termRouter,
  sessionRouter,
  invoiceRouter,
  feeRouter,
  notificationRouter,
  authRouter,
  announcementRouter,
};
