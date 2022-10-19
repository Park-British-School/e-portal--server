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
  classController.findAllClasses(
    {
      paginate: request.query.paginate === "true" ? true : false,
      count: request.query.count ? parseInt(request.query.count) : 10,
      page: request.query.page ? parseInt(request.query.page) : 1,
    },
    (error, classes) => {
      if (error) {
        response.status(400).send(error);
      } else {
        response.status(200).json(classes);
      }
    }
  );
});

router.get("/find-one", (request, response) => {
  if (request.query.by) {
    switch (request.query.by) {
      case "ID":
        classController.findClassByID(request.query.ID, (error, _class) => {
          if (error) {
            response.status(400).send(error);
          } else {
            if (_class) {
              response.status(200).json(_class);
            } else {
              response.status(400).send(`class does not exist`);
            }
          }
        });
        break;

      case "name":
        classController.findClassByName(request.query.name, (error, _class) => {
          if (error) {
            response.status(400).send(error);
          } else {
            if (_class) {
              response.status(200).json(_class);
            } else {
              response.status(400).send(`class does not exist`);
            }
          }
        });
        break;

      default:
        response.status(400).send("Incorrect query parameters");
        break;
    }
  } else {
    response.status(400).send("Incorrect query parameters");
  }
});

router.get("/:classID", classController.getClass);
router.post("/:classID/students/remove", classController.removeStudent);
router.post("/:classID/teachers/remove", classController.removeTeacher);
router.post("/:classID/subjects/", classController.getAllSubjects);
router.post("/:classID/subjects/add", classController.addSubject);
router.post("/:classID/subjects/delete", classController.deleteSubject);

//REFACTORING ENDS HERE

module.exports = router;
