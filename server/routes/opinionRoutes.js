const express = require("express")
const router = express.Router()
const { validationResult, check } = require("express-validator")
const { Opinion } = require("../models") // assuming you have this model

const postOpinion = async (req, res) => {
	const errors = validationResult(req)
	if (!errors.isEmpty()) {
		return res.status(400).json({ errors: errors.array() })
	}

	const { text } = req.body
	const username = req.user.username

	const opinion = new Opinion({ username, text })
	await opinion.save()

	res.send(opinion)
}

router.post(
	"/",
	[check("text").notEmpty().withMessage("Opinion text is required.")],
	postOpinion
)

module.exports = router
