const express = require("express")
const router = express.Router()
const { decodeToken } = require("../middleware/authMiddleware")

const { loginadmin } = require("../controllers/adminAuthController")

router.post("/loginadmin", loginadmin)

const {
	getPost,
	newPost,
	deletePost,
	updatePost,
} = require("../controllers/postController")

router.get("/article", getPost)
router.post("/article", decodeToken, newPost)
router.delete("/article", deletePost)
router.patch("/article", updatePost)

const {
	newRates,
	newRemaning,
	getRates,
	getRemaning,
	getExchange,
	exchangeStatus,
} = require("../controllers/adminController")

router.patch("/rates", newRates)
router.patch("/remaning", newRemaning)
router.patch("/exchange", exchangeStatus)
router.get("/rates", getRates)
router.get("/remaning", getRemaning)
router.get("/exchange", getExchange)

module.exports = router
