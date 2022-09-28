const router = require("express").Router();
const controllers = require("../controllers");

const { termController } = controllers;

router.get("/", termController.getTerm);

router.post("/set", termController.setTerm);

module.exports = router;
