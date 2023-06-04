const express = require("express")
const router = express.Router()
const { decodeToken, auth } = require("../middleware/authMiddleware")

const {
	newArticle,
	newRates,
	newRemaning,
	getRates,
	getRemaning,
	getExchange,
	exchangeStatus,
} = require("../controllers/adminController")

router.post("/article", decodeToken, newArticle)
router.patch("/rates", newRates)
router.patch("/remaning", newRemaning)
router.patch("/exchange", exchangeStatus)
router.get("/rates", getRates)
router.get("/remaning", getRemaning)
router.get("/exchange", getExchange)

module.exports = router
