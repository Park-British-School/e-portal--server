const verifyAccessToken = require("./verifyAccessToken");
const generateStudentID = require("./generateStudentID");
const aggregateScores = require("./aggregateScores");
const generateResultPDF = require("./generateResultPDF")
const verifySession = require("./verifySession")

module.exports = {
  verifyAccessToken,
  generateStudentID,
  aggregateScores,
  generateResultPDF,
  verifySession
};
