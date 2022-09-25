const router = require("express").Router();
const {
  getAllResults,
  getResult,
  addResult,
  deleteResult,
  editResult,
  approveResult,
  getResultsByClass,
  downloadResult,

  countAllResults,
  findAllResults,
} = require("../controllers/resultController");
const aggregateScores = require("../middlewares/aggregateScores");
const generateResultPDF = require("../middlewares/generateResultPDF");

// TO BE REMOVED AFTER STABLE
router.get("/", getAllResults);
// END

router.get("/find-all", (request, response) => {
  findAllResults((error, results) => {
    if (error) {
      response.status(400).send(error);
    } else {
      response.status(200).json(results);
    }
  });
});

router.get("/find", (request, response) => {
  findAllResults((error, results) => {
    if (error) {
      response.status(400).send(error);
    } else {
      response.status(200).json(results);
    }
  });
});

router.get("/count-all", (request, response) => {
  countAllResults((error, count) => {
    if (error) {
      response.status(400).send(error);
    } else {
      response.status(200).send(count.toString());
    }
  });
});

router.get("/:id", getResult);
router.get("/class/:classID", getResultsByClass);
router.post("/", aggregateScores, addResult);
router.post("/:resultID/edit", editResult);
router.get("/:resultID/approve", approveResult);
router.get("/:resultID/download", downloadResult, generateResultPDF);
router.get("/delete/:resultID", deleteResult);

module.exports = router;
