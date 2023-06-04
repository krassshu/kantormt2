const express = require("express")
const router = express.Router()
const { auth } = require("../middleware/authUserMiddleware")
const { exchangeForm } = require("../controllers/exchangeController")

router.post("/exchange", auth, exchangeForm)

module.exports = router
