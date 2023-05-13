const express = require("express")
const router = express.Router()

const {
	login,
	logout,
	loginadmin,
	registration,
} = require("../controllers/authController")

router.post("/login", login)
router.post("/logout", logout)
router.post("/loginadmin", loginadmin)
router.post("/registration", registration)

module.exports = router
