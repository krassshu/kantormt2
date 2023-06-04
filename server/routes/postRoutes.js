const express = require("express")
const router = express.Router()
const { decodeToken } = require("../middleware/authMiddleware")

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

module.exports = router
