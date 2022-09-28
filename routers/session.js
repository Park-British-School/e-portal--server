const router = require("express").Router();
const controllers = require("../controllers");

const { sessionController } = controllers;

router.get("/", sessionController.getSession);

router.post("/set", sessionController.setSession);

module.exports = router;
