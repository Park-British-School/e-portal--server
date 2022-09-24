const router = require('express').Router()
const {getTerm, setTerm} = require('../controllers/termController')

router.get("/", getTerm)

router.post("/set", setTerm)

module.exports = router