const router = require("express").Router();
const controllers = require("../controllers");

const { teacherController } = controllers;

router.get("/count-all", (request, response) => {
  teacherController.countAllTeachers((error, count) => {
    if (error) {
      response.status(400).send(error);
    } else {
      response.status(200).send(count.toString());
    }
  });
});

router.get("/find-all-deprecated", (request, response) => {
  teacherController.findAllTeachers({}, (error, teachers) => {
    if (error) {
      response.status(400).send(error);
    } else {
      response.status(200).json(teachers);
    }
  });
});

router.get("/find-one-deprecated", (request, response) => {
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

router.post("/create", (request, response) => {
  teacherController.findTeacherByEmailAddress(
    request.body.email,
    (error, teacher) => {
      if (error) {
        response.status(400).send(error);
      } else {
        if (teacher) {
          response
            .status(400)
            .send("Teacher with this e-mail address already exists!");
        } else {
          teacherController.createTeacher(
            { ...request.body },
            (error, teacher) => {
              if (error) {
                response.status(400).send(error);
              } else {
                response.status(200).json(teacher);
              }
            }
          );
        }
      }
    }
  );
});

router.get("/delete-one", (request, response) => {
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
                teacherController.deleteTeacherByID(teacher._id, (error) => {
                  if (error) {
                    response.status(400).send(error);
                  } else {
                    response.status(200).end();
                  }
                });
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

router.get("/find-all", controllers.teacherController.findAll);
router.get("/find-one", controllers.teacherController.findOne);
router.post("/update-one", controllers.teacherController.updateOne);

router.get("/:id", teacherController.getTeacher);

//REFACTORING ENDS HERE

module.exports = router;
