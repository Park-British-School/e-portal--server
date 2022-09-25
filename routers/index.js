const studentRouter = require("./student");
const teacherRouter = require("./teacher");
const classRouter = require("./class");
const resultRouter = require("./result");
const imageRouter = require("./image");
const adminRouter = require("./admin");
const termRouter = require("./term");
const sessionRouter = require("./session");
const billingRouter = require("./billing");
const invoiceRouter = require("./invoice"); // this is the new naming and import convention
const feeRouter = require("./fee");
const notificationRouter = require("./notification");

module.exports = {
  studentRouter,
  teacherRouter,
  classRouter,
  resultRouter,
  imageRouter,
  adminRouter,
  termRouter,
  sessionRouter,
  billingRouter,
  invoiceRouter,
  feeRouter,
  notificationRouter, // this is the new naming convention
};
