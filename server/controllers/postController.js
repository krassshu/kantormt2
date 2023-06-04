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
		res.status(500).json({
			message: "Error occurred while fetching posts: " + error.message,
		})
	}
}
const deletePost = async (req, res) => {
	const { id } = req.body

	if (!id) {
		return res.status(400).json({ message: "Invalid id." })
	}
	try {
		const post = await Post.findById(id)

		if (!post) {
			return res.status(404).json({ message: "Post not found." })
		}

		await post.remove()

		return res.status(200).json({ message: "Post deleted successfully." })
	} catch (error) {
		return res.status(500).json({ message: "Server error." })
	}
}
const updatePost = async (req, res) => {
	const { id, content } = req.body

	try {
		const post = await Post.findById(id)

		if (!post) {
			return res.status(404).json({ message: "Post not found." })
		}

		post.content = content
		const updatedPost = await post.save()

		return res
			.status(200)
			.json({ message: "Post updated successfully.", post: updatedPost })
	} catch (error) {
		return res.status(500).json({ message: "Server error." })
	}
}

module.exports = { getPost, deletePost, updatePost }
