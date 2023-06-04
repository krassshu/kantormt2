const express = require("express")
const router = express.Router()

const {
	getPost,
	deletePost,
	updatePost,
} = require("../controllers/postController")

router.get("/article", getPost)
router.delete("/article", deletePost)
router.patch("/article", updatePost)

module.exports = router
