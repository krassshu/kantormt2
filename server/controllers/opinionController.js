const { validationResult } = require("express-validator")
const { Opinion } = require("../models")

const postOpinion = async (req, res) => {
	const errors = validationResult(req)
	if (!errors.isEmpty()) {
		return res.status(400).json({ errors: errors.array() })
	}

	if (!req.user || !req.user.username) {
		return res.status(401).send("Musisz być zalogowany by wystawić opinię")
	}

	const { text } = req.body
	const username = req.user.username
	const currentDate = new Date()
	let month = currentDate.getMonth() + 1
	let day = currentDate.getDate()
	if (day < 10) {
		day = `0${day}`
	}
	if (month < 10) {
		month = `0${month}`
	}
	const date = `${day}.${month}.${currentDate.getFullYear()}r.`

	const opinion = new Opinion({ username, text, date })
	await opinion.save()

	res.send(opinion)
}

module.exports = { postOpinion }
