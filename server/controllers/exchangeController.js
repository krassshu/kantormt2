const express = require("express")
const router = express.Router()
const { validationResult, check } = require("express-validator")
const { Exchange } = require("../models")

const exchangeForm = async (req, res) => {
	if (!req.user || !req.user.username) {
		return res.status(401).json({ error: "Użytkownik musi być zalogowany." })
	}

	const errors = validationResult(req)
	if (!errors.isEmpty()) {
		return res.status(400).json({ errors: errors.array() })
	}

	const { serverNick, serverFrom, serverTo, amountFrom, amountTo } = req.body
	const userId = req.user._id
	const discordNick = req.user.discordNick // Change "discord" to "discordNick"
	const currentDate = new Date()
	let month = currentDate.getMonth() + 1
	let day = currentDate.getDate()
	let hours = currentDate.getHours()
	let minutes = currentDate.getMinutes()
	if (day < 10) {
		day = `0${day}`
	}
	if (month < 10) {
		month = `0${month}`
	}
	if (hours < 10) {
		hours = `0${hours}`
	}
	if (minutes < 10) {
		minutes = `0${minutes}`
	}
	const date = `${hours}:${minutes} ${day}/${month}/${currentDate.getFullYear()}`
	const resolved = false

	const exchange = new Exchange({
		userId,
		serverNick,
		discordNick,
		serverFrom,
		amountFrom,
		serverTo,
		amountTo,
		date,
		resolved,
	})
	await exchange.save()

	res.send(exchange)
}
module.exports = { exchangeForm }
