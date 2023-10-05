const express = require("express");
const controllers = require("../controllers");

const { termController } = controllers;
const { Router } = express;

const router = Router();

router.get("/", termController.getTerm);

router.post("/set-deprecated", termController.setTerm);

module.exports = router;
