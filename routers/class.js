const router = require("express").Router();
const controllers = require("../controllers");

const { classController } = controllers;

// router.get("/", getAllClasses)
// router.get("/:classID", getClass)
// router.post("/addClass", addClass)
// router.post("/assignstudent", assignStudent)
// router.post("/:classID/students/remove", removeStudent)
// router.post("/assignteacher", assignTeacher)
// router.post("/:classID/teachers/remove", removeTeacher)
// router.post("/:classID/subjects/", getAllSubjects)
// router.post("/:classID/subjects/add", addSubject)
// router.post("/:classID/subjects/delete", deleteSubject)

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

//REFACTORING ENDS HERE

module.exports = router;
