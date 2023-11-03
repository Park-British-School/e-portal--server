const router = require("express").Router();
const multer = require("multer");
const imageUpload = require("../middlewares/imageUpload");

router.post("/upload", imageUpload.single("image"), (req, res) => {
  try {
    console.log(req.body);
  } catch (err) {
    res.status(400).send(err);
  }
});

module.exports = router;
