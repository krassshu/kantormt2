const { Post } = require("../models")

const getPost = async (req, res) => {
	try {
		const post = await Post.find()
		if (!post) {
			res.status(400).json({ message: "Brak postów" })
			return
		}
		res.json(post)
	} catch (error) {
		res
			.status(500)
			.json({
				message: "Error occurred while fetching posts: " + error.message,
			})
	}
}

module.exports = { getPost }
