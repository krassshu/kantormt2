const express = require("express")
const router = express.Router()
const { check } = require("express-validator")
const { Exchange } = require("../models") // assuming you have this model

const exchangeForm = async (req, res) => {
	const errors = validationResult(req)
	if (!errors.isEmpty()) {
		return res.status(400).json({ errors: errors.array() })
	}

	const { serverFrom, serverTo, amountFrom, amountTo } = req.body
	const username = req.user.username

	const exchange = new Exchange({
		serverFrom,
		serverTo,
		amountFrom,
		amountTo,
		username,
	})
	await exchange.save()

	res.send(exchange)
}

router.post("/", exchangeForm)

module.exports = router
