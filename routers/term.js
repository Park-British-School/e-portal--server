const express = require("express");
const controllers = require("../controllers");

const { termController } = controllers;
const { Router } = express;

termRouter = Router();

termRouter.get("/", termController.getTerm);

termRouter.post("/set", termController.setTerm);

module.exports = termRouter;
