const express = require("express");
const controllers = require("../controllers");

const router = express.Router();

router.post("/create", controllers.conversation.create);
router.get("/:conversation_id/find", controllers.conversation.single.find);

module.exports = router;
