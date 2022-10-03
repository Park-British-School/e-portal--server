const router = require("express").Router();
const controllers = require("../controllers");
const middlewares = require("../middlewares");

const generateResultPDF = require("../middlewares/generateResultPDF");

const { resultController } = controllers;
const { aggregateScores } = middlewares;

// TO BE REMOVED AFTER STABLE
router.get("/", resultController.getAllResults);
// END

// REFACTORING STARTS HERE
router.get("/find-all", (request, response) => {
  resultController.findAllResults(
    {
      paginate: request.query.paginate === "true" ? true : false,
      count: request.query.count ? parseInt(request.query.count) : 10,
      page: request.query.page ? parseInt(request.query.page) : 1,
    },
    (error, results) => {
      if (error) {
        response.status(400).send(error);
      } else {
        response.status(200).json(results);
      }
    }
  );
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

// router.get("/:id", getResult);
// router.get("/class/:classID", getResultsByClass);
// router.post("/", aggregateScores, addResult);
// router.post("/:resultID/edit", editResult);
// router.get("/:resultID/approve", approveResult);
// router.get("/:resultID/download", downloadResult, generateResultPDF);
// router.get("/delete/:resultID", deleteResult);

module.exports = router;
