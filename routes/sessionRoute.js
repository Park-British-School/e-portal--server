const router = require('express').Router()
const {getSession, setSession} = require('../controllers/sessionController')


router.get("/", getSession)

router.post("/set", setSession)

module.exports = router