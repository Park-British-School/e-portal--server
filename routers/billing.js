const router = require('express').Router()
const {
  getAllFees,
  createFee,
  deleteFee,
  getAllInvoices,
} = require("../controllers/billingController")

router.get("/fees/", getAllFees)
//router.get("/fees/:id", getResult)
router.post("/fees/", createFee)
router.delete("/fees/:feeID", deleteFee)
// router.get("/invoices/", getAllInvoices)
// router.get("/invoices/:id", getResult)
// router.post("/invoices/", addResult)
// router.delete("/invoices/:id", getResult)

// router.get("/:id", getResult)
// router.get("/class/:classID", getResultsByClass)
// router.post("/", aggregateScores, addResult)
// router.post("/:resultID/edit", editResult)
// router.get("/:resultID/approve", approveResult)
// router.get("/:resultID/download", downloadResult, generateResultPDF)
// router.get("/delete/:resultID", deleteResult)


module.exports = router