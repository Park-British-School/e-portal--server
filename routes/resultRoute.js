const router = require('express').Router()
const {
  getAllResults,
  getResult,
  addResult,
  deleteResult,
  editResult,
  approveResult,
  getResultsByClass,
  downloadResult
} = require("../controllers/resultController")
const aggregateScores = require('../middlewares/aggregateScores')
const generateResultPDF = require('../middlewares/generateResultPDF')

router.get("/", getAllResults)
router.get("/:id", getResult)
router.get("/class/:classID", getResultsByClass)
router.post("/", aggregateScores, addResult)
router.post("/:resultID/edit", editResult)
router.get("/:resultID/approve", approveResult)
router.get("/:resultID/download", downloadResult, generateResultPDF)
router.get("/delete/:resultID", deleteResult)


module.exports = router