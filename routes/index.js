const studentRoute = require('./studentRoute')
const teacherRoute = require('./teacherRoute')
const classRoute = require('./classRoute')
const resultRoute = require('./resultRoute')
const imageRoute = require("./imageRoute")
const adminRoute = require('./adminRoute')
const termRoute = require('./termRoute')
const sessionRoute = require('./sessionRoute')
const billingRoute = require("./billingRoute")
const invoiceRouter = require("./invoice") // this is the new naming and import convention
const feeRouter = require("./fee")
const notificationRouter = require('./notification')

module.exports = {
  studentRoute,
  teacherRoute,
  classRoute,
  resultRoute,
  imageRoute,
  adminRoute,
  termRoute,
  sessionRoute,
  billingRoute,
  invoiceRouter,
  feeRouter,
  notificationRouter  // this is the new naming convention
}