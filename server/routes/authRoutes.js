const express = require("express")
const router = express.Router()

const { login, logout, registration } = require("../controllers/authController")

router.post("/login", login)
router.post("/logout", logout)
router.post("/registration", registration)

module.exports = router
