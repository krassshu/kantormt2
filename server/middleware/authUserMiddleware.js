const jwt = require("jsonwebtoken")

function auth(req, res, next) {
	const token = req.cookies.token
	if (!token) return res.status(401).send("Zaloguj się i spróbuj ponownie.")

	try {
		const decoded = jwt.verify(token, process.env.JWT_PRIVATE_KEY)
		req.user = decoded
		next()
	} catch (ex) {
		res.status(400).send("Invalid token.")
	}
}

function decodeToken(req, res, next) {
	const token = req.cookies.token
	if (!token) return next()

	try {
		const decoded = jwt.verify(token, process.env.JWT_PRIVATE_KEY)
		req.user = decoded
		next()
	} catch (ex) {
		next()
	}
}

module.exports = { auth, decodeToken }
