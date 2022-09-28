const router = require("express").Router();
const controllers = require("../controllers");
const aggregateScores = require("../middlewares/aggregateScores");
const generateResultPDF = require("../middlewares/generateResultPDF");

const { resultController } = controllers;

// TO BE REMOVED AFTER STABLE
router.get("/", resultController.getAllResults);
// END

// REFACTORING STARTS HERE
router.get("/find-all", (request, response) => {
  resultController.findAllResults((error, results) => {
    if (error) {
      response.status(400).send(error);
    } else {
      response.status(200).json(results);
    }
  });
});

router.get("/find", (request, response) => {
  resultController.findAllResults((error, results) => {
    if (error) {
      response.status(400).send(error);
    } else {
      response.status(200).json(results);
    }
  });
});

router.get("/count-all", (request, response) => {
  resultController.countAllResults((error, count) => {
    if (error) {
      response.status(400).send(error);
    } else {
      response.status(200).send(count.toString());
    }
  });
});

router.get("/find-one", (request, response) => {
  switch (request.query.by) {
    case ID:
      resultController.findResultbyID(request.query.ID, (error, result) => {
        if (error) {
          response.status(400).send(error);
        } else {
          if (result) {
            response.status(200).json(result);
          } else {
            response.status(400).send(error);
          }
        }
      });
      break;

    default:
      response.status(400).send("Incorrect query parameters");
      break;
  }
});
// REFACTORING ENDS HERE

// router.get("/:id", getResult);
// router.get("/class/:classID", getResultsByClass);
// router.post("/", aggregateScores, addResult);
// router.post("/:resultID/edit", editResult);
// router.get("/:resultID/approve", approveResult);
// router.get("/:resultID/download", downloadResult, generateResultPDF);
// router.get("/delete/:resultID", deleteResult);

module.exports = router;
