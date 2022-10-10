const router = require("express").Router();
const controllers = require("../controllers");

const { teacherController } = controllers;

// router.get("/", getAllTeachers)
// router.get("/:id", getTeacher)
// router.post("/addTeacher", addTeacher)
// router.post("/signin", login)
// router.post("/:teacherID/profile/edit", editProfile)
// router.get("/activate/:teacherID", activate)
// router.get("/deactivate/:teacherID", deactivate)
// router.get("/delete/:teacherID", _delete)

// REFACTORING STARTS HERE

router.get("/count-all", (request, response) => {
  teacherController.countAllTeachers((error, count) => {
    if (error) {
      response.status(400).send(error);
    } else {
      response.status(200).send(count.toString());
    }
  });
});

router.get("/find-all", (request, response) => {
  teacherController.findAllTeachers((error, teachers) => {
    if (error) {
      response.status(400).send(error);
    } else {
      response.status(200).json(teachers);
    }
  });
});

router.get("/find-one", (request, response) => {
  if (request.query.by) {
    switch (request.query.by) {
      case "ID":
        teacherController.findTeacherByID(
          request.query.ID,
          (error, teacher) => {
            if (error) {
              response.status(400).send(error);
            } else {
              if (teacher) {
                response.status(200).json(teacher);
              } else {
                response.status(400).send(`teacher does not exist`);
              }
            }
          }
        );
        break;

      case "emailAddress":
        teacherController.findTeacherByEmailAddress(
          request.query.name,
          (error, teacher) => {
            if (error) {
              response.status(400).send(error);
            } else {
              if (teacher) {
                response.status(200).json(teacher);
              } else {
                response.status(400).send(`teacher does not exist`);
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

//REFACTORING ENDS HERE

module.exports = router;
