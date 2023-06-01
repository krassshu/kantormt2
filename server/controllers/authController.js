const bcrypt = require("bcrypt")
const jwt = require("jsonwebtoken")
const { validationResult } = require("express-validator")
const { User, Admin } = require("../models")

const login = async (req, res) => {
	const { username, password } = req.body
	const user = await User.findOne({ username })
	if (!user)
		return res.status(400).json({ error: "Niewłaściwy login lub hasło." })

	const validPassword = await bcrypt.compare(password, user.password)
	if (!validPassword)
		return res.status(400).json({ error: "Niewłaściwy login lub hasło." })

	const token = jwt.sign(
		{
			_id: user._id,
			username: user.username,
			email: user.email,
			discordNick: user.discordNick, // Change "discord" to "discordNick"
		},
		process.env.JWT_PRIVATE_KEY,
		{ expiresIn: "7d" } // token will expire in 7 days
	)
	res.cookie("token", token, {
		httpOnly: true,
		maxAge: 7 * 24 * 60 * 60 * 1000,
	}) // set cookie to expire in 7 days
	res.send({
		message: "Login successful",
		username: user.username,
		_id: user._id,
	})
}

const logout = (req, res) => {
	res.clearCookie("token")
	res.send({ message: "Logout successful" })
}

const loginadmin = async (req, res) => {
	const errors = validationResult(req)
	if (!errors.isEmpty()) {
		return res.status(400).json({ errors: errors.array() })
	}
	const { username, password } = req.body
	const admin = await Admin.findOne({ username })
	if (!admin) return res.status(400).send("Invalid username or password.")

	const validPassword = await bcrypt.compare(password, admin.password)
	if (!validPassword)
		return res.status(400).send("Invalid username or password.")

	const token = jwt.sign(
		{
			_id: admin._id,
			username: admin.username,
			email: admin.email,
		},
		process.env.JWT_PRIVATE_KEY,
		{ expiresIn: "7d" } // token will expire in 7 days
	)
	res.cookie("token", token, {
		httpOnly: true,
		maxAge: 7 * 24 * 60 * 60 * 1000,
	}) // set cookie to expire in 7 days
	res.json({ redirectUrl: "/admin-panel.html" });
}

const registration = async (req, res) => {
	const { username, email, password, discordNick } = req.body

	let mail = await User.findOne({ email })
	if (mail) return res.status(400).send("e-mail")

	let user = await User.findOne({ username })
	if (user) return res.status(400).send("user")

	let discord = await User.findOne({ discordNick })
	if (discord) return res.status(400).send("discord")

	const salt = await bcrypt.genSalt(10)
	const hashedPassword = await bcrypt.hash(password, salt)

	user = new User({ username, email, password: hashedPassword, discordNick }) // Add discordNick here
	await user.save()
	res.send({
		message: "Registration successful",
		username: user.username,
		email: user.email,
		discord: user.discordNick,
	})
}

module.exports = { login, logout, loginadmin, registration }
