const { Post, Currency, Admin } = require("../models")

const newArticle = async (req, res) => {
	try {
		const { content } = req.body
		const admin = req.user.username
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

		const article = new Post({ content, admin, date })
		await article.save()
		res.send(article)
	} catch (error) {
		console.log(error)
		res.status(500).send("Wystąpił błąd podczas dodawania artykułu")
	}
}

const newRates = async (req, res) => {
	try {
		const { glevia, alune, pangea, samia, valium, ervelia } = req.body.rates

		const update = await Currency.findOneAndUpdate(
			{},
			{
				"rates.glevia": glevia,
				"rates.alune": alune,
				"rates.pangea": pangea,
				"rates.samia": samia,
				"rates.valium": valium,
				"rates.ervelia": ervelia,
			},
			{
				new: true,
			}
		)

		if (!update) {
			res.status(404).json({ message: "Nie można zaktualizować kursów" })
			return
		}

		res.json({ message: "Kursy zaktualizowane pomyślnie", data: update })
	} catch (err) {
		res.status(500).json({
			message: "Wystąpił błąd podczas aktualizacji kursów",
			error: err.message,
		})
	}
}

const newRemaning = async (req, res) => {
	try {
		const { glevia, alune, pangea, samia, valium, ervelia } = req.body.remaning

		const update = await Currency.findOneAndUpdate(
			{},
			{
				"remaning.glevia": glevia,
				"remaning.alune": alune,
				"remaning.pangea": pangea,
				"remaning.samia": samia,
				"remaning.valium": valium,
				"remaning.ervelia": ervelia,
			},
			{
				new: true,
			}
		)

		if (!update) {
			res.status(404).json({ message: "Nie można zaktualizować kursów" })
			return
		}

		res.json({ message: "Kursy zaktualizowane pomyślnie", data: update })
	} catch (err) {
		res.status(500).json({
			message: "Wystąpił błąd podczas aktualizacji kursów",
			error: err.message,
		})
	}
}

module.exports = { newArticle, newRates, newRemaning }
