const router = require('express').Router()
const {
  getAllTeachers,
  getTeacher,
  addTeacher,
  login,
  activate,
  deactivate,
  _delete,
  editProfile
} = require("../controllers/teacherController")

router.get("/", getAllTeachers)
router.get("/:id", getTeacher)
router.post("/addTeacher", addTeacher)
router.post("/signin", login)
router.post("/:teacherID/profile/edit", editProfile)
router.get("/activate/:teacherID", activate)
router.get("/deactivate/:teacherID", deactivate)
router.get("/delete/:teacherID", _delete)

module.exports = router