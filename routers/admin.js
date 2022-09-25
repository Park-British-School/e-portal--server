const router = require('express').Router()
const {getAllAdmins, getAdmin, addAdmin, login} = require("../controllers/adminController")

router.get("/", getAllAdmins)
router.get("/:id", getAdmin)
router.post("/addAdmin", addAdmin)
router.post("/signin", login)

module.exports = router