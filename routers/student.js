const router = require("express").Router();
const multer = require("multer");
const controllers = require("../controllers");
const generateStudentID = require("../middlewares/generateStudentID");

const { studentController } = controllers;

// router.get("/:studentID", getStudent);
// router.get("/:studentID/notifications", getAllNotifications);
// router.post("/:studentID/profile/edit", editProfile);
// router.post("/addStudent", generateStudentID, addStudent);
// router.post("/login", login);

// router.get("/activate/:studentID", activate);
// router.get("/deactivate/:studentID", deactivate);
// router.get("/delete/:studentID", _delete);

router.get("/", studentController.findAllStudents);

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
  studentController.findAllStudents((error, students) => {
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
          request.query.ID,
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
        response.status(400).send("Incorrect query parameters");
        break;
    }
  } else {
    response.status(400).send("Incorrect query parameters");
  }
});

module.exports = router;
