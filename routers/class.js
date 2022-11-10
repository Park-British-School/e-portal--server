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

// router.get("/update-one", (request, response) => {
//   if (request.query.by) {
//     switch (request.query.by) {
//       case "ID":
//         classController.updateClassByID(request.query.ID, {
//           action: request.query.action,
//         });
//         break;
//       case "name":
//         classController.updateClassByName;
//         break;
//       default:
//         response.status(400).send("Incorrect query parameters");
//     }
//   } else {
//     response.status(400).send("Incorrect query parameters");
//   }
// });

router.get("/:classID/students/assign", (request, response) => {
  classController.students.assign(
    request.params.classID,
    request.query.studentID,
    (error) => {
      if (error) {
        response.status(400).send(error);
      } else {
        response.status(200).end();
      }
    }
  );
});

router.get("/:classID/students/deassign", (request, response) => {
  classController.students.deassign(
    request.params.classID,
    request.query.studentID,
    (error) => {
      if (error) {
        response.status(400).send(error);
      } else {
        response.status(200).end();
      }
    }
  );
});

router.get("/:classID/teachers/assign", (request, response) => {
  classController.teachers.assign(
    request.params.classID,
    request.query.emailAddress,
    (error) => {
      if (error) {
        response.status(400).send(error);
      } else {
        response.status(200).end();
      }
    }
  );
});

router.get("/:classID/teachers/deassign", (request, response) => {
  classController.teachers.deassign(
    request.params.classID,
    request.query.teacherID,
    (error) => {
      if (error) {
        response.status(400).send(error);
      } else {
        response.status(200).end();
      }
    }
  );
});

router.get("/:classID/subjects/add", (request, response) => {
  classController.subjects.add(
    request.params.classID,
    request.query.subject,
    (error) => {
      if (error) {
        response.status(400).send(error);
      } else {
        response.status(200).end();
      }
    }
  );
});

router.get("/:classID/subjects/remove", (request, response) => {
  classController.subjects.remove(
    request.params.classID,
    request.query.subject,
    (error) => {
      if (error) {
        response.status(400).send(error);
      } else {
        response.status(200).end();
      }
    }
  );
});

router.post("/:classID/subjects/add", classController.addSubject);
router.post("/:classID/subjects/delete", classController.deleteSubject);

//REFACTORING ENDS HERE

module.exports = router;
