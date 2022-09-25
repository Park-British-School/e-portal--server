const router = require("express").Router();
const multer = require("multer");
const controllers = require("../controllers");
const {
  getAllStudents,
  login,
  addStudent,
  getStudent,
  activate,
  deactivate,
  editProfile,
  _delete,
  getAllNotifications,
} = require("../controllers/studentController");
const generateStudentID = require("../middlewares/generateStudentID");

router.get("/", getAllStudents);

router.get("/count-all", (request, response)=>{
  
});

router.get("/:studentID", getStudent);
router.get("/:studentID/notifications", getAllNotifications);
router.post("/:studentID/profile/edit", editProfile);
router.post("/addStudent", generateStudentID, addStudent);
router.post("/login", login);

router.get("/activate/:studentID", activate);
router.get("/deactivate/:studentID", deactivate);
router.get("/delete/:studentID", _delete);

module.exports = router;
