const router = require("express").Router();
const controllers = require("../controllers");

const { classController } = controllers;

router.get("/", classController.getAllClasses);

router.post("/addClass", classController.addClass);
router.post("/assignstudent", classController.assignStudent);

router.post("/assignteacher", classController.assignTeacher);

// REFACTORING STARTS HERE

router.get("/count-all", (request, response) => {
  classController.countAllClasses((error, count) => {
    if (error) {
      response.status(400).send(error);
    } else {
      response.status(200).send(count.toString());
    }
  });
});

router.get("/find-all", (request, response) => {
  classController.findAllClasses((error, classes) => {
    if (error) {
      response.status(400).send(error);
    } else {
      response.status(200).json(classes);
    }
  });
});

router.get("/:classID", classController.getClass);
router.post("/:classID/students/remove", classController.removeStudent);
router.post("/:classID/teachers/remove", classController.removeTeacher);
router.post("/:classID/subjects/", classController.getAllSubjects);
router.post("/:classID/subjects/add", classController.addSubject);
router.post("/:classID/subjects/delete", classController.deleteSubject);

//REFACTORING ENDS HERE

module.exports = router;
