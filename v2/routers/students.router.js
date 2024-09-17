const express = require("express");
const controllers = require("../controllers");

const router = express.Router();

router.all("/pins/scramble", controllers.students.pins.scramble)

router.all("/:id/authorize", controllers.students.single.authorize);

module.exports = router;
