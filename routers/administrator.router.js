const express = require("express");
const controllers = require("../controllers");
const middlewares = require("../middlewares");
const models = require("../models");
const { Router } = express;

const administratorRouter = Router();

administratorRouter.get(
  "/metrics",
  middlewares.verifyAccessToken,
  middlewares.verifySession,
  controllers.administratorController.metrics
);

administratorRouter.get(
  "/find-all",
  middlewares.verifyAccessToken,
  middlewares.verifySession,
  controllers.administratorController.findAll
);

administratorRouter.post(
  "/create",
  middlewares.verifyAccessToken,
  middlewares.verifySession,
  controllers.administratorController.create
);

administratorRouter.get(
  "/find-one",
  middlewares.verifyAccessToken,
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

administratorRouter.all(
  "/:administrator_id/find",
  controllers.administratorController.single.find
);

administratorRouter.all(
  "/:administrator_id/update",
  controllers.administratorController.single.update
);

administratorRouter.all(
  "/:administrator_id/ban",
  controllers.administratorController.single.ban
);

administratorRouter.all(
  "/:administrator_id/unban",
  controllers.administratorController.single.unban
);

administratorRouter.all(
  "/:administrator_id/delete",
  controllers.administratorController.single.delete
);

administratorRouter.all(
  "/activity-logs/find-all",
  middlewares.verifyAccessToken,
  middlewares.verifySession,
  controllers.administratorController.activityLogs.findAll
);

administratorRouter.all(
  "/activity-logs/delete-all",
  controllers.administratorController.activityLogs.deleteAll
);

administratorRouter.param(
  "administrator_id",
  async function (request, response, next, id) {
    try {
      const administrator = await models.administratorModel.findOne({
        _id: id,
        isDeleted: false,
      });
      if (!administrator) {
        return response.status(400).json({
          message: "Administrator not found!",
          error: true,
          statusCode: 400,
        });
      }
      request.payload = { ...request.payload };
      request.payload.administrator = administrator;
      next();
    } catch (error) {
      console.log(error.message);
      console.log(error.stack);
      return response.status(400).json({
        message: "Unable to process this request!",
        statusCode: 400,
        error: true,
      });
    }
  }
);

module.exports = administratorRouter;
