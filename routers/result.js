const router = require("express").Router();
const controllers = require("../controllers");
const middlewares = require("../middlewares");

const { resultController } = controllers;
const { aggregateScores, generateResultPDF } = middlewares;

router.get("/search", controllers.resultController.search);
router.post(
  "/upload",
  middlewares.aggregateScores,
  controllers.resultController.upload
);
router.get("/find-all", controllers.resultController.findAll);
router.get("/find-one", controllers.resultController.findOne);
router.get("/delete-one", controllers.resultController.deleteOne);
router.post(
  "/update-one",
  middlewares.aggregateScores,
  controllers.resultController.updateOne
);

router.get("/", resultController.getAllResults);
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

router.get("/:id", resultController.getResult);

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
