const bcrypt = require("bcrypt")
const jwt = require("jsonwebtoken")
// const { validationResult } = require("express-validator")
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
		// Przyjmij dane z żądania
		const { glevia, alune, pangea, samia, valium, ervelia } = req.body.rates

		// Znajdź i zaktualizuj wartości w bazie danych
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
				new: true, // Ta opcja zwraca nową wersję dokumentu po aktualizacji
			}
		)

		// Jeżeli nie udało się zaktualizować dokumentu, wyślij odpowiednią informację
		if (!update) {
			res.status(404).json({ message: "Nie można zaktualizować kursów" })
			return
		}

		// Wyślij potwierdzenie, że operacja zakończyła się sukcesem
		res.json({ message: "Kursy zaktualizowane pomyślnie", data: update })
	} catch (err) {
		// Obsłuż błędy
		res
			.status(500)
			.json({
				message: "Wystąpił błąd podczas aktualizacji kursów",
				error: err.message,
			})
	}
}

module.exports = { newArticle, newRates }
// , newRemaning