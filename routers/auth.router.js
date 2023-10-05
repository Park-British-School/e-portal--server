const express = require("express");
const controllers = require("../controllers");
const middlewares = require("../middlewares");

const { Router } = express;
const { authController } = controllers;

const authRouter = Router();

authRouter.post("/sign-in/student-deprecated", (request, response) => {
  authController.signin_deprecated.student(
    request.body.studentID || "",
    request.body.password || "",
    (error, accessToken) => {
      if (error) {
        response.status(400).send(error);
      } else {
        response.status(200).send(accessToken);
      }
    }
  );
});

authRouter.post("/sign-in/teacher-deprecated", (request, response) => {
  authController.signin_deprecated.teacher(
    request.body.email,
    request.body.password,
    (error, data) => {
      if (error) {
        response.status(400).send(error);
      } else {
        response.status(200).json(data);
      }
    }
  );
});
authRouter.get("/verify-access-token", (request, response) => {
  authController.verifyAccessToken(request.query.accessToken, (error, data) => {
    if (error) {
      response.status(400).send(error.message);
    } else {
      response.status(200).json(data);
    }
  });
});
authRouter.post("/sign-in/admin", authController.signIn.administrator);

authRouter.post(
  "/sign-in/administrator",
  controllers.authController.signIn.administrator
);
authRouter.post("/sign-in/teacher", controllers.authController.signIn.teacher);
authRouter.post(
  "/sign-in/student",

  controllers.authController.signIn.student
);

authRouter.post(
  "/sign-out/administrator",
  middlewares.verifyAccessToken,
  controllers.authController.signOut.administrator
);

module.exports = authRouter;
