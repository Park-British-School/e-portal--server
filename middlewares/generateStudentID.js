const uuid = require("uuid")

function generateStudentID(req, res, next) {
  const studentID = `pbs/${new Date().getFullYear()}/${uuid.v4().split("-")[0]}`
  req.body._id = studentID
  next()
}

module.exports = generateStudentID