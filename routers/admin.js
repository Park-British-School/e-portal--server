const express = require("express");
const controllers = require("../controllers");

const { adminController } = controllers;
const { Router } = express;

const adminRouter = Router();

adminRouter.get("/find-all", (request, response) => {
  adminController.findAllAdmins(
    {
      paginate: request.query.paginate === "true" ? true : false,
      count: request.query.count ? parseInt(request.query.count) : 10,
      page: request.query.page ? parseInt(request.query.page) : 1,
    },
    (error, admins) => {
      if (error) {
        response.status(400).send(error);
      } else {
        response.status(200).send(admins);
      }
    }
  );
});

adminRouter.post("/create", (request, response) => {
  adminController.findAdminByEmailAddress(
    request.body.emailAddress,
    (error, document) => {
      if (error) {
        response.status(400).send(error);
      } else {
        if (document) {
          response.status(400).send("This email already exists");
        } else {
          adminController.createAdmin({ ...request.body }, (error, admin) => {
            if (error) {
              response.status(400).send(error);
            } else {
              response.status(200).json(admin);
            }
          });
        }
      }
    }
  );
});

adminRouter.get("/password/reset", adminController.password.reset);

adminRouter.get(
  "/password/reset-pin/generate",
  adminController.password.resetPin.generate
);

adminRouter.get(
  "/password/reset-pin/verify",
  adminController.password.resetPin.verify
);


module.exports = adminRouter;
