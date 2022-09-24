const router = require('express').Router()
const { getAllClasses, getClass, addClass, assignStudent, assignTeacher, addSubject, deleteSubject, getAllSubjects, removeStudent, removeTeacher } = require('../controllers/classController')

router.get("/", getAllClasses)
router.get("/:classID", getClass)
router.post("/addClass", addClass)
router.post("/assignstudent", assignStudent)
router.post("/:classID/students/remove", removeStudent)
router.post("/assignteacher", assignTeacher)
router.post("/:classID/teachers/remove", removeTeacher)
router.post("/:classID/subjects/", getAllSubjects)
router.post("/:classID/subjects/add", addSubject)
router.post("/:classID/subjects/delete", deleteSubject)

module.exports = router