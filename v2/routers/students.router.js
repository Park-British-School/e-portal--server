const express = require("express");
const controllers = require("../controllers");

const router = express.Router();

router.all("/pins/scramble", controllers.students.pins.scramble)

router.all("/:id/authorize", controllers.students.single.authorize);

router.all("/:id/update", controllers.students.single.update)

module.exports = router;
