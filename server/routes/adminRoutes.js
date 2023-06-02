const express = require("express")
const router = express.Router()
const { decodeToken } = require("../middleware/authMiddleware")

const {
	newArticle,
	newRates,
	newRemaning,
	getRates,
	getRemaning,
} = require("../controllers/adminController")

router.post("/article", decodeToken, newArticle)
router.patch("/rates", newRates)
router.patch("/remaning", newRemaning)
router.get("/rates", getRates)
router.get("/remaning", getRemaning)

module.exports = router
