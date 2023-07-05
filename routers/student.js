const router = require("express").Router();
const multer = require("multer");
const controllers = require("../controllers");
const middlewares = require("../middlewares");

const { studentController } = controllers;
const { generateStudentID } = middlewares;

router.get("/count-all", (request, response) => {
  studentController.countAllStudents((error, count) => {
    if (error) {
      response.status(400).send(error);
    } else {
      response.status(200).send(count.toString());
    }
  });
});

router.get("/find-all", (request, response) => {
  studentController.findAllStudents(
    {
      paginate: request.query.paginate === "true" ? true : false,
      count: request.query.count ? parseInt(request.query.count) : 10,
      page: request.query.page ? parseInt(request.query.page) : 1,
    },
    (error, students) => {
      if (error) {
        response.status(400).send(error);
      } else {
        response.status(200).json(students);
      }
    }
  );
});

router.post("/search", (request, response) => {
  studentController.search(request.body.search, (error, students) => {
    if (error) {
      response.status(400).send(error);
    } else {
      response.status(200).json(students);
    }
  });
});

router.get("/find-one", (request, response) => {
  if (request.query.by) {
    switch (request.query.by) {
      case "ID":
        studentController.findStudentByID(
          request.query.ID.replaceAll("-", "/"),
          (error, student) => {
            if (error) {
              response.status(400).send(error);
            } else {
              if (student) {
                response.status(200).json(student);
              } else {
                response.status(400).send(`student does not exist`);
              }
            }
          }
        );
        break;

      case "name":
        studentController.findStudentByName(
          request.query.name,
          (error, student) => {
            if (error) {
              response.status(400).send(error);
            } else {
              if (student) {
                response.status(200).json(student);
              } else {
                response.status(400).send(`student does not exist`);
              }
            }
          }
        );
        break;

      default:
        response.status(400).send("Incorrect query parameters.");
        break;
    }
  } else {
    response.status(400).send("Incorrect query parameters");
  }
});

router.post("/create", generateStudentID, (request, response) => {
  studentController.createStudent({ ...request.body }, (error, student) => {
    if (error) {
      response.status(400).send(error);
    } else {
      response.status(200).json(student);
    }
  });
});

router.get("/:studentID", studentController.getStudent);

router.get("/:studentID/results", (request, response) => {
  studentController.results.findAll(
    request.params.studentID.replace(/-/g, "/"),
    (error, results) => {
      if (error) {
        console.log("error ", error)
        response.status(400).send(error);
      } else {
        console.log("data", results)
        response.status(200).json(results);
      }
    }
  );
});

router.get("/:studentID/invoices", (request, response) => {
  studentController.invoices.findAll(
    request.params.studentID.replace(/-/g, "/"),
    (error, invoices) => {
      if (error) {
        response.status(400).send(error);
      } else {
        response.status(200).json(invoices);
      }
    }
  );
});

router.post("/:studentID/update", (request, response) => {
  studentController.findStudentByID(
    request.params.studentID.replace(/-/g, "/"),
    (error, student) => {
      if (error) {
        response.status(400).send(error);
      } else {
        if (student) {
          studentController.updateStudentByID(
            student._id,
            { ...request.body },
            (error) => {
              if (error) {
                response.status(400).send(error);
              } else {
                response.status(200).end();
              }
            }
          );
        } else {
          response.status(400).send("Student does not exist");
        }
      }
    }
  );
});

router.get("/:studentID/delete", (request, response) => {
  studentController.deleteStudentByID(
    request.params.studentID.replace(/-/g, "/"),
    (error) => {
      if (error) {
        response.status(400).send(error);
      } else {
        response.status(200).end();
      }
    }
  );
});

router.get("/:studentID/notifications", (request, response) => {
  studentController.notifications.findAll(
    request.params.studentID.replace(/-/g, "/"),
    (error, notifications) => {}
  );
});

router.get("/:studentID/notifications", studentController.getAllNotifications);
router.post("/:studentID/profile/edit", studentController.editProfile);
router.get("/activate/:studentID", studentController.activate);
router.get("/deactivate/:studentID", studentController.deactivate);
router.get("/delete/:studentID", studentController._delete);

module.exports = router;
