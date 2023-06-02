const express = require("express")
const router = express.Router()
const { decodeToken } = require("../middleware/authMiddleware")

const {
	newArticle,
	newRates,
	newRemaning,
} = require("../controllers/adminController")

router.post("/article", decodeToken, newArticle)
router.patch("/rates", newRates)
router.patch("/remaning", newRemaning)

module.exports = router
