const express = require("express");
const jsonwebtoken = require("jsonwebtoken");
const controllers = require("../controllers");

const { Router } = express;
const { authController } = controllers;

const authRouter = Router();

authRouter.post("/sign-in/student", (request, response) => {
  authController.signin.student(
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

authRouter.post("/sign-in/teacher", (request, response) => {
  authController.signin.teacher(
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

authRouter.post("/sign-in/admin", authController.signin.admin);

authRouter.get("/verify-access-token", (request, response) => {
  authController.verifyAccessToken(request.query.accessToken, (error, data) => {
    if (error) {
      response.status(400).send(error.message);
    } else {
      response.status(200).json(data);
    }
  });
});

authRouter.get("/sign-out/student", (request, response) => {
  authController.signOut.student((error) => {});
});

module.exports = authRouter;
