const router = require("express").Router();
const controllers = require("../controllers");
const middlewares = require("../middlewares");

const { resultController } = controllers;
const { aggregateScores, generateResultPDF } = middlewares;

// TO BE REMOVED AFTER STABLE
router.get("/", resultController.getAllResults);
// END

// REFACTORING STARTS HERE
router.get("/find-all", controllers.resultController.findAll);

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

router.post("/upload", aggregateScores, (request, response) => {
  resultController.uploadResult(data, (error) => {
    if (error) {
      response.status(400).send(error);
    } else {
      response.status(200).end();
    }
  });
});
// REFACTORING ENDS HERE

router.get("/:id", resultController.getResult);

router.post("/", aggregateScores, resultController.addResult);
router.post("/:resultID/edit", resultController.editResult);
router.get("/:resultID/approve", (request, response) => {
  resultController.approveResult(request.params.resultID, (error) => {
    if (error) {
      response.status(400).send(error);
    } else {
      response.status(200).end();
    }
  });
});

router.get(
  "/:resultID/download",
  resultController.downloadResult,
  generateResultPDF
);

router.get("/:resultID/delete", (request, response) => {
  resultController.deleteResult(request.params.resultID, (error) => {
    if (error) {
      response.status(400).send(error);
    } else {
      response.status(200).end();
    }
  });
});

// router.get("/class/:classID", getResultsByClass);

module.exports = router;
