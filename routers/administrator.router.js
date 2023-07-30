const express = require("express");
const controllers = require("../controllers");

const { adminController } = controllers;
const { Router } = express;

const administratorRouter = Router();

administratorRouter.get(
  "/find-all",
  controllers.administratorController.findAll
);

administratorRouter.post("/create", (request, response) => {
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

administratorRouter.get(
  "/find-one",
  controllers.administratorController.findOne
);

administratorRouter.post(
  "/update-one",
  controllers.administratorController.updateOne
);

administratorRouter.get(
  "/delete-one",
  controllers.administratorController.deleteOne
);

module.exports = administratorRouter;
