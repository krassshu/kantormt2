const express = require("express")
const router = express.Router()

const { getPost } = require("../controllers/postController")

router.get("/article", getPost)

module.exports = router
