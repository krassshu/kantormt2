const jwt = require("jsonwebtoken")

function auth(req, res, next) {
	const admtoken = req.cookies.admtoken
	if (!admtoken) return res.status(401).send("Access denied. No token provided.")

	try {
		const decoded = jwt.verify(admtoken, process.env.JWT_PRIVATE_KEY)
		req.user = decoded
		if (req.user.admin) {
			next()
		} else {
			res.status(403).send("Access denied. You are not an admin.")
		}
	} catch (ex) {
		res.status(400).send("Invalid token.")
	}
}

function decodeToken(req, res, next) {
	const admtoken = req.cookies.admtoken
	if (!admtoken) return next()

	try {
		const decoded = jwt.verify(admtoken, process.env.JWT_PRIVATE_KEY)
		req.user = decoded
		next()
	} catch (ex) {
		next()
	}
}

module.exports = { auth, decodeToken }
