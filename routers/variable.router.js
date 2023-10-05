const express = require("express");

const router = express.Router();
const controllers = require("../controllers");

router.get("/get", controllers.variableController.get);
router.all("/set", controllers.variableController.set);

module.exports = router;
