const express = require("express");
const controllers = require("../controllers");

const { Router } = express;
const { notificationController } = controllers;

const { getAll, create, deleteByID, updateByID } = notificationController;

const notificationRouter = Router();

notificationRouter.get("/", getAll);

notificationRouter.post("/", create);

notificationRouter.patch("/:notificationID", updateByID);
notificationRouter.delete("/:notificationID", deleteByID);

module.exports = notificationRouter;
