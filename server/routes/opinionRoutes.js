const express = require("express")
const router = express.Router()
const { auth } = require("../middleware/authUserMiddleware")
const { postOpinion } = require("../controllers/opinionController")

router.post("/opinion", auth, postOpinion)

module.exports = router
