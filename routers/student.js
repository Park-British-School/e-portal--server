const router = require("express").Router();
const multer = require("multer");
const controllers = require("../controllers");
const generateStudentID = require("../middlewares/generateStudentID");

const { studentController } = controllers;

router.post("/addStudent", generateStudentID, studentController.addStudent);
router.post("/login", studentController.login);

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

router.get("/find", (request, response) => {
  studentController.findStudents();
});

router.get("/:studentID", studentController.getStudent);
router.get("/:studentID/notifications", studentController.getAllNotifications);
router.post("/:studentID/profile/edit", studentController.editProfile);
router.get("/activate/:studentID", studentController.activate);
router.get("/deactivate/:studentID", studentController.deactivate);
router.get("/delete/:studentID", studentController._delete);

module.exports = router;
